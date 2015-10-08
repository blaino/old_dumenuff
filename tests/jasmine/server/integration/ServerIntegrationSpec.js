describe('Collection: Channels', function () {
    it("on startup there should be general and random channels", function () {
        expect(Channels.find().count()).toBeGreaterThan(0);
        expect(Channels.find({name: "general"})).not.toBe(null);
        expect(Channels.find({name: "random"})).not.toBe(null);

        // expect(Channels.find({name: "blik"})).toThrow();
    });
});

describe('Collection: Messages', function () {
    it("on startup there should not be any messages", function () {
        expect(Messages.find().count()).toEqual(0);
    });
});

describe('Users', function () {
    it('should each have a score', function () {
        user = Meteor.users.findOne({});
        expect(user.score).toEqual(0);

        users = Meteor.users.find({});
        users.map(function (u) {
            expect(u.score).toEqual(0);
        });
    });

    it("should include a user with username 'player'", function () {
        expect(Meteor.users.findOne({username: "player"})).not.toBe(null);
    });

    it("new ones should have their score set to 0", function () {
        Accounts.createUser({
            username: "integUser",
            email: "integUser@example.com",
            password: "password"
        });

        user = Meteor.users.findOne({username: "integUser"});

        expect(user.score).toEqual(0);

        Meteor.users.remove({username: "integUser"});
    });
});
