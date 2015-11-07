describe('Integration test', function () {
    console.log('=== Start: Integration Test ===');

    var percentBot = 100,
        readyTime = 1,
        gameTime = 100,
        numPlayers = 4;

    Meteor.call('cleanUp');

    Meteor.call('newGame', readyTime, gameTime, numPlayers, percentBot);

    // Simulate client-side adding of players (app.js)
    Meteor.call('addStartingPlayers', numPlayers);

    // Assume, for now, that checkReady() works (depends on counting logins)
    Meteor.call('readyGame');

    // Should start game after readyTime seconds
    // Could have an expectation of called with 'startGame'
    Meteor._sleepForMs(readyTime * 1000 * 4);  // This sucks

    Meteor.call('postMessages');


    it('should have ' + numPlayers + ' channels (100% bot)', function () {
        var numChannels = Channels.find({}).count();
        expect(numChannels).toEqual(numPlayers);
    });

    it('should have ' + numPlayers + ' messages', function () {
        var numMessages = Messages.find({}).count();
        expect(numMessages).toEqual(numPlayers);
    });

    it("should have the right score after 'a round'", function () {
        player0 = Meteor.users.find({username: 'seedUser1'}).fetch()[0];
        Meteor.call('updateWinnerLoserScore', player0._id, "bot");
        var p0score = Scores.find({player: player0._id}).fetch()[0];
        expect(p0score.score).toEqual(1);
    });


    console.log('=== End: Integration Test ===');
});
