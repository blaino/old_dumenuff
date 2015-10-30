Meteor.methods({
    newMessage: function (user, message) {
  	message.timestamp = Date.now();
        message.user = user;
        Messages.insert(message);
    },

    reply: function (message) {
        var RiveScript = Meteor.npmRequire('rivescript');
        var rs = new RiveScript();

        var reply = Async.runSync(function (done) {
            rs.loadDirectory(
                "/Users/blainenelson/projects/vk/lib/brain",
                function(batch_num) {
                    rs.sortReplies();
                    var reply = rs.reply("local-user", message);
                    done(null, reply);
                });
        });
        var delay = 1000 + 2000 * Math.random();
        Meteor._sleepForMs(delay);
        return reply.result;
    },

    updateScore: function (winnerId, loserId) {
        var winnerScore = Scores.findOne({player: winnerId});
        var loserScore = Scores.findOne({player: loserId});

        if (winnerScore) {
            //console.log('updating winner');
            Scores.update({player: winnerId}, {$inc: {score: 1}});
        } else {
            //console.log('adding winner to Score with score 1');
            Scores.insert({player: winnerId, score: 1});
        }

        if (loserScore) {
            //console.log('updating loser');
            Scores.update({player: loserId}, {$inc: {score: -1}});
        } else {
            //console.log('adding loser to Score with score -1');
            Scores.insert({player: loserId, score: -1});
        }
    },

    addPlayer: function (playerId) {
        Waiting.insert({player: playerId, timeEntered: Date.now()});
    },

    match: function (percentBot) {
        var room;

        // get Waiting sorted
        var waiting = Waiting.find({}, {sort: {timeEntered: 1}}).fetch();

        // get the oldest, remove from Waiting
        var oldest = waiting[0];
        Waiting.remove({player: oldest.player});

        var matchWithBot = Math.random() < (percentBot / 100);

        if (!matchWithBot) {
            // pick random from rest, remove
            var remaining = Waiting.find({}).fetch();
            var count = remaining.length;
            var index = Math.floor(Math.random() * count);
            var randomSelection = remaining[index];
            Waiting.remove({player: randomSelection.player});

            // create a room with oldest and the random selection
            room = {player1: oldest.player, player2: randomSelection.player};
        } else {
            room = {player1: oldest.player, player2: "bot"};
        };

        // add it to Rooms
        Rooms.insert(room);
    },

    findRoom: function (userId) {
        var rooms = Rooms.find({}).fetch();
        var foundRoom = null;
        rooms.forEach(function (room) {
            if ((room.player1 == userId) || (room.player2 == userId)) {
                foundRoom = room;
            };
        });
        if (foundRoom) {
            return foundRoom;
        } else {
            throw new Meteor.Error("Room for " + userId + " not found");
        }
    },

    getWinner: function (room, selectee, selection) {

        var selector;

        if (room.player1 === selectee) {
            selector = room.player2;
        } else {
            selector = room.player1;
        };

        if (selection === "human" && selectee !== "bot") {
            return [selector, selectee];
        };

        if (selection === "bot" && selectee == "bot") {
            return [selector, selectee];
        };

        if (selection == "bot" && selectee !== "bot") {
            return [selectee, selector];
        };
    },

    getOtherPlayer: function(playerId) {
        var room = Meteor.call('findRoom', playerId);
        if (room.player1 != playerId) {
            return room.player1;
        } else {
            return room.player2;
        }
    },

    updateWinnerLoserScore: function(playerId, selection) {
        var room = Meteor.call('findRoom', playerId);
        var otherPlayerId = Meteor.call('getOtherPlayer', playerId);
        var winnerPair = Meteor.call('getWinner', room, otherPlayerId, selection);
        Meteor.call('updateScore', winnerPair[0], winnerPair[1]);
    }
});
