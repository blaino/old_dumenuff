Meteor.methods({
    cleanUp: function () {
        Messages.remove({});
        Channels.remove({});
        Meteor.users.remove({});
        Rooms.remove({});
        Scores.remove({});
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

    matchPlayers: function (percentBot) {
        var waiting = Waiting.find({}).fetch().length;
        while (waiting > 0) {
            Meteor.call('match', percentBot);
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
                        text: "A first message for " + user.username,
                        user: user._id,
                        timestamp: Date.now(),
                        channel: room._id
                    });
                    Factory.create('message');
                };
            });
        });
    },

    countLogins: function () {
        var users = Meteor.users.find({'services.resume': {$exists: true}});
        return users.count();
    },

    // Called on startup
    newGame: function () {
        Game.remove({});
        // setup config file? or config page?
        Game.insert({state: "Waiting", readyTime: 10, gameTime: 30, numPlayers: 3, numReady: 0});
    },

    readyGame: function () {
        Game.update({}, {$set: {state: "Readying"}});
        // set timeout to call startGame()
        var timerId;

        function decReadyTime () {
            Game.update({}, {$inc: {readyTime: -1}});
            var game = Game.findOne({});
            if (game.readyTime <= 0) {
                Meteor.clearInterval(timerId);
                Meteor.call('startGame');
            }
        };

        timerId = Meteor.setInterval(decReadyTime, 1000);
    },

    startGame: function () {
        Game.update({}, {$set: {state: "Started"}});
        Meteor.call('matchPlayers', 50);
        Meteor.call('createChannels');
        // set timeout to call endGame()
        // meanwhile, update gameTime so front end can show it
        // in 1s increments?
    },

    endGame: function () {
        Game.update({}, {$set: {state: "Ended"}}); // Maybe add winner: username?
        // Determine winner, sort and display results or something
        Rooms.remove({});
        Scores.remove({});
        Waiting.remove({});
    }
});
