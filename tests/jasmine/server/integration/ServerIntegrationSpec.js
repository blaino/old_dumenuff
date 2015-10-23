// TODO: get rid of this

describe('Collections', function () {

    // Valid in prime time, but not with a bunch of seeder data:
    // describe('Channels', function () {
    //     it("on startup there should not be any", function () {
    //         expect(Channels.find().count()).toEqual(0);
    //     });
    // });

    // describe('Messages', function () {
    //     it("on startup there should not be any", function () {
    //         expect(Messages.find().count()).toEqual(0);
    //     });
    // });
});

describe('Integration test', function () {
    var numPlayers = 4;
    Meteor.call('cleanUp');
    Meteor.call('addStartingPlayers', numPlayers);
    Meteor.call('matchPlayers');
    Meteor.call('createChannels');
    Meteor.call('postMessages');

    console.log('messages', Messages.find({}).fetch());

    it('should have ' + (numPlayers / 2) + ' channels', function () {
        var numChannels = Channels.find({}).count();
        expect(numChannels).toEqual(numPlayers / 2);
    });
    it('should have ' + numPlayers + ' messages', function () {
        var numMessages = Messages.find({}).count();
        expect(numMessages).toEqual(numPlayers);
    });
});
