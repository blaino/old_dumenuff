Meteor.methods({
    cleanUp: function () {
        Messages.remove({});
        Meteor.users.remove({});
        Rooms.remove({});
        Channels.remove({});
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

    matchPlayersOld: function (percentBot) {
        var waiting = Waiting.find({}).fetch().length;
        while (waiting > 0) {
            Meteor.call('match', percentBot);
            waiting = Waiting.find({}).fetch().length;
        };
    },

    matchPlayers: function (percentBot, threshold, pauseTime) {
        var waiting = Waiting.find({}).fetch().length;
        while (waiting >= threshold) {
            Meteor.call('match', percentBot);
            waiting = Waiting.find({}).fetch().length;
        };
        waiting = Waiting.find({}).fetch().length;
        if (waiting > 0) {
            Meteor._sleepForMs(pauseTime);
            while (waiting > 0) {
                Meteor.call('match', percentBot);
                waiting = Waiting.find({}).fetch().length;
            };
        };
    },

    postMessages: function () {
        users = Meteor.users.find({}).fetch();
        users.forEach(function (user) {
            Meteor.call('findRoom', user._id, function (error, room) {
                if (error) {
                    console.log('postMessage() cannot find room: ', error);
                } else {
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

    checkReady: function () {
        var numPlayers = Game.findOne({}).numPlayers;
        var loginCount = Meteor.call('countLogins');
        var game = Game.findOne({});

        // Ready when in Waiting and have right number of players
        return (loginCount == numPlayers && game.state == 'Waiting');
    },

    // Called on startup
    newGame: function (readyTime, gameTime, numPlayers, percentBot) {
        var oldGame = Game.findOne({});
        Game.insert({state: "Waiting", readyTime: readyTime, gameTime: gameTime,
                     numPlayers: numPlayers, percentBot: percentBot, numReady: 0});
        Game.remove(oldGame);
    },

    readyGame: function () {
        Game.update({}, {$set: {state: "Readying"}});
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
        var game = Game.findOne({});
        var percentBot = game.percentBot;
        var timerId;
        var threshold = 2;
        var pauseTime = 6000;

        Meteor.call('matchPlayers', percentBot, threshold, pauseTime);

        function decGameTime () {
            Game.update({}, {$inc: {gameTime: -1}});
            var game = Game.findOne({});
            if (game.gameTime <= 0) {
                Meteor.clearInterval(timerId);
                Meteor.call('endGame');
            }
        };

        timerId = Meteor.setInterval(decGameTime, 1000);
    },

    endGame: function () {
        Game.update({}, {$set: {state: "Ended"}}); // Maybe add winner: username?
        // Determine winner, sort and display results or something
        Rooms.remove({});
        Scores.remove({});
        Waiting.remove({});
    }
});
