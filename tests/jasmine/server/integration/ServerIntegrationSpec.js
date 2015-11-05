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
    Meteor.call('postMessages');

    it('should have ' + (numPlayers / 2) + ' channels', function () {
        var numChannels = Channels.find({}).count();
        expect(numChannels).toEqual(numPlayers / 2);
    });

    it('should have ' + numPlayers + ' messages', function () {
        var numMessages = Messages.find({}).count();
        expect(numMessages).toEqual(numPlayers);
    });

    it('should change the score when updateScore() is called', function () {
        var userId = Meteor.users.findOne({username: "seedUser4"})._id;

        // First call initializes score. Rethink?
        Meteor.call('updateScore', userId);
        var beforeScore = Scores.findOne({player: userId}).score;
        Meteor.call('updateScore', userId);
        var afterScore = Scores.findOne({player: userId}).score;

        expect(beforeScore).not.toEqual(afterScore);
    });

});
