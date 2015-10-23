Meteor.methods({
    cleanUp: function () {
        Messages.remove({});
        Channels.remove({});
        Meteor.users.remove({});
        Rooms.remove({});
        Waiting.remove({});
    },

    addStartingPlayers: function (numPlayers) {
        var player;
        for (i = 1; i <= numPlayers; i++) {
            if (!Meteor.users.findOne({username: "seedUser" + i})) {
                Accounts.createUser({
                    username: "seedUser" + String(i),
                    email: "seedUser" + String(i) + "@example.com",
                    password: "password"
                });
                player = Meteor.users.findOne({username: "seedUser" + String(i)});
                Meteor.call('addPlayer', player._id);
            };
        };
    },

    matchPlayers: function () {
        var waiting = Waiting.find({}).fetch().length;
        while (waiting > 0) {
            Meteor.call('match');
            waiting = Waiting.find({}).fetch().length;
        };
    },

    createChannels: function () {
        var rooms = Rooms.find({});
        rooms.forEach(function (room) {
            Channels.insert({
                name: room._id
            });
        });
    },

    postMessages: function () {
        users = Meteor.users.find({});
        users.forEach(function (user) {
            Meteor.call('findRoom', user._id, function (error, room) {
                if (room) {
                    Factory.define('message', Messages, {
                        text: "A first message for" + user.username,
                        user: user._id,
                        timestamp: Date.now(),
                        channel: room._id
                    });
                    Factory.create('message');
                };
            });
        });
    }
});
