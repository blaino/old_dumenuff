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
        var player1 = Meteor.users.findOne({username: "seedUser1"})._id;
        Factory.define('message', Messages, {
            text: "A first message for seedUser1",
            user: player1,
            timestamp: Date.now(),
            channel: Rooms.findOne({player1: player1})._id
        });
        Factory.create('message');

        // Loop through each user and create a starter message
        // (need to write findRoom(userId))
    }
});
