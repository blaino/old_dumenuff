Meteor.methods({
    cleanUp: function () {
        Messages.remove({});
        // Meteor.users.remove({});
        Rooms.remove({});
        Channels.remove({});
        Scores.remove({});
        Waiting.remove({});
        Game.remove({});
        Time.remove({});

        Channels.insert({name: "lobby"});
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

    matchPlayers: function (percentBot, threshold, shufflePause) {
        var waiting = Waiting.find({}).fetch().length;
        while (waiting >= threshold) {
            Meteor.call('match', percentBot);
            waiting = Waiting.find({}).fetch().length;
        };
    },

    matchPlayersComplex: function (percentBot, threshold, shufflePause) {
        var waiting = Waiting.find({}).fetch().length;
        while (waiting >= threshold) {
            Meteor.call('match', percentBot);
            waiting = Waiting.find({}).fetch().length;
        };
        waiting = Waiting.find({}).fetch().length;
        if (waiting > 0) {
            Meteor._sleepForMs(shufflePause);
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
        var count = Waiting.find({}).fetch().length;
        var game = Game.findOne({});

        // Ready when in Waiting and have right number of players
        return (count == numPlayers && game.state == 'Waiting');
    },

    // Called on startup
    newGame: function (readyTime, gameTime, numPlayers, percentBot) {
        var oldGame = Game.findOne({});
        var oldTime = Time.findOne({});
        Game.insert({state: "Waiting",
                     readyTime: readyTime,
                     numPlayers: numPlayers,
                     percentBot: percentBot,
                     numReady: 0,
                     threshold: Meteor.settings.public.threshold,
                     shufflePause: Meteor.settings.public.shufflePause});
        Time.insert({gameTime: gameTime});
        Game.remove(oldGame);
        Time.remove(oldTime);
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
        var threshold = game.threshold;
        var shufflePause = Meteor.settings.public.shufflePause;

        Meteor.call('matchPlayers', percentBot, threshold, shufflePause);

        function decGameTime () {
            Time.update({}, {$inc: {gameTime: -1}});
            var time = Time.findOne({});
            if (time.gameTime <= 0) {
                Meteor.clearInterval(timerId);
                Meteor.call('endGame');
            }
        };

        timerId = Meteor.setInterval(decGameTime, 1000);
    },

    endGame: function () {
        Game.update({}, {$set: {state: "Ended"}});

        // This should get blown away when a new one starts
        // Rooms.remove({});
        // Scores.remove({});
        // Waiting.remove({});
    }
});
