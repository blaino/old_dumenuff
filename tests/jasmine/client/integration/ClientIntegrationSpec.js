describe('Integration test', function () {
    var numPlayers = 4;
    Meteor.call('cleanUp');
    Meteor.call('addStartingPlayers', numPlayers);
    Meteor.call('matchPlayers');
    Meteor.call('createChannels');
    Meteor.call('postMessages');

    console.log('client side messages', Messages.find({}).fetch());

    it('should have ' + (numPlayers / 2) + ' channels', function () {
        var numChannels = Channels.find({}).count();
        expect(numChannels).toEqual(numPlayers / 2);
    });
    it('should have ' + numPlayers + ' messages', function () {
        var numMessages = Messages.find({}).count();
        expect(numMessages).toEqual(numPlayers);
    });

    // Set channel - do you need to do this?
    // var player1 = Meteor.users.findOne({username: "seedUser1"})._id;
    // var channel = Rooms.findOne({player1: player1})._id;
    // Session.set('channel', channel);
});
