describe('Integration test', function () {
    var numPlayers = 4;

    // On the client, these may not be synchronous:
    // Meteor.call('cleanUp');
    // Meteor.call('addStartingPlayers', numPlayers);
    // Meteor.call('matchPlayers');
    // Meteor.call('createChannels');
    // Meteor.call('postMessages');

    // Maybe???
    beforeEach(function (done) {
        Meteor.call('cleanUp', function () {
            Meteor.call('addStartingPlayers', numPlayers, function () {
                Meteor.call('matchPlayers', function () {
                    Meteor.call('createChannels', function () {
                        Meteor.call('postMessages', function () {
                            done();
                        });
                    });
                });
            });
        });
    });


    // console.log('client side messages', Messages.find({}).fetch());

    // it('should have ' + (numPlayers / 2) + ' channels', function () {
    //     var numChannels = Channels.find({}).count();
    //     expect(numChannels).toEqual(numPlayers / 2);
    // });

    // it('should have ' + numPlayers + ' messages', function () {
    //     var numMessages = Messages.find({}).count();
    //     expect(numMessages).toEqual(numPlayers);
    // });

    it('should change the score when bot button is clicked', function () {
        var user = Meteor.users.findOne({username: "seedUser4"});
        var userId = user._id;
        var beforeScore;
        var afterScore;

        Meteor.loginWithPassword(user.username, "password", function (error) {
            console.log('error', error);
            if (!error) {

                Meteor.call('updateScore', Meteor.userId(), function () {
                    beforeScore = Scores.findOne({player: userId}).score;

                    $('#bot-button').click();

                    afterScore = Scores.findOne({player: userId}).score;

                    console.log('scores', beforeScore, afterScore);
                    expect(beforeScore).not.toEqual(afterScore);
                });
            };
        });
        expect(true).toEqual(false);
    });

    // Set channel - do you need to do this?
    // var player1 = Meteor.users.findOne({username: "seedUser1"})._id;
    // var channel = Rooms.findOne({player1: player1})._id;
    // Session.set('channel', channel);
});
