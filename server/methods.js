Meteor.methods({
    newMessage: function (user, message) {
  	message.timestamp = Date.now();
        message.user = user;
        Messages.insert(message);
    },

    reply: function (message) {
        var RiveScript = Meteor.npmRequire('rivescript');
        var rs = new RiveScript();

        var path = Npm.require('path');
        var basepath = path.resolve();
        path = basepath + "/assets/app/brain-eliza";

        var reply = Async.runSync(function (done) {
            rs.loadDirectory(
                path,
                function(batch_num) {
                    rs.sortReplies();
                    var reply = rs.reply("local-user", message);
                    done(null, reply);
                });
        });
        var charCount = reply.result.length;
        var delay = 120 * charCount + 3000 * Math.random();
        Meteor._sleepForMs(delay);
        return reply.result;
    },

    updateScore: function (winnerId, loserId) {
        var winnerName;
        var loserName;

        if (winnerId != "bot") {
            if (loserId != "bot") {
                loserName = Meteor.users.findOne({_id: loserId}).username;
            } else {
                loserName = "bot";
            }
            Scores.update({player: winnerId},
                          {$inc: {score: 1},
                           $set: {result: "right", opponent: loserName}});
        };

        if (loserId != "bot") {
            if (winnerId != "bot") {
                winnerName = Meteor.users.findOne({_id: winnerId}).username;
            } else {
                winnerName = "bot";
            }
            Scores.update({player: loserId},
                          {$inc: {score: -2},
                           $set: {result: "wrong", opponent: winnerName}});
        };
    },

    addPlayer: function (playerId) {
        var alreadyWaiting = Waiting.findOne({player: playerId});
        if (typeof alreadyWaiting == 'undefined') {
            Waiting.insert({player: playerId, timeEntered: Date.now()});
            Game.update({}, {$inc: {numReady: 1}});
            Scores.insert({player: playerId, score: 0, result: "", opponent: ""});
        }
    },

    match: function (percentBot) {
        var room;

        // get Waiting sorted
        var waiting = Waiting.find({}, {sort: {timeEntered: 1}}).fetch();

        if (waiting.length > 0) {

            // get the oldest, remove from Waiting
            var oldest = waiting[0];
            Waiting.remove({player: oldest.player});

            var matchWithBot = Math.random() < (percentBot / 100);

            if (!matchWithBot) {
                // pick random from rest, remove
                var remaining = Waiting.find({}).fetch();
                if (remaining.length > 0) {
                    var count = remaining.length;
                    var index = Math.floor(Math.random() * count);
                    var randomSelection = remaining[index];
                    Waiting.remove({player: randomSelection.player});

                    // create a room with oldest and the random selection
                    room = {player1: oldest.player, player2: randomSelection.player};
                } else {
                    // but if there isn't anyone available, assign to bot
                    room = {player1: oldest.player, player2: "bot"};
                }
            } else {
                room = {player1: oldest.player, player2: "bot"};
            };

            room.liveTime = Date.now();

            // add channel
            Rooms.insert(room, function (error, roomId) {
                if (error) {
                    console.log('In match() trying to insert channel: ', error);
                } else {
                    Channels.insert({name: roomId});
                }
            });
        }
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

        if (selection == "human" && selectee == "bot") {
            return [selectee, selector];
        };
    },

    getOtherPlayer: function(playerId, room) {
        if (room.player1 != playerId) {
            return room.player1;
        } else {
            return room.player2;
        }
    },

    scoreAndRematch: function(playerId, selection, room) {
        // Delete room, channels
        Rooms.remove(room);
        Channels.remove({name: room._id});

        var otherPlayerId = Meteor.call('getOtherPlayer', playerId, room);
        var winnerPair = Meteor.call('getWinner', room, otherPlayerId, selection);

        Meteor.call('updateScore', winnerPair[0], winnerPair[1]);
        Meteor.call('rematch', playerId, room);
    },

    rematch: function (playerId, room) {

        // Put both players (from room) in the Waiting queue (if not bot)
        Waiting.insert({player: room.player1, timeEntered: Date.now()});
        if (room.player2 != 'bot') {
            Waiting.insert({player: room.player2, timeEntered: Date.now()});
        };

        // call matchPlayers()
        var game = Game.findOne({});
        var percentBot = game.percentBot;
        var threshold = game.threshold;
        var shufflePause = game.shufflePause;

        Meteor.call('matchPlayers', percentBot, threshold, shufflePause);
    },

    greeting: function (channel, user) {
        if (channel != 'lobby') {
            if (Math.random() < 0.50) {
                var room = Meteor.call('findRoom', user);
                if (room) {
                    var otherPlayer = Meteor.call('getOtherPlayer', user, room);
                    if (otherPlayer == 'bot') {
                        var result = Meteor.call('reply', 'xxxgreetingxxx');
                        Meteor.call('newMessage',
                                    Meteor.users.findOne({username: "player"}),
                                    {text: result, channel: room._id});
                    }
                }
            }
        }
    }
});
