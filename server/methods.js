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

    updateScore: function (winnerId) {

        console.log('updateScroe called with id:', winnerId);

        // Look for winner in scores
        var winnerScore = Scores.findOne({player: winnerId});

        // If winner is there, increment score
        if (winnerScore) {
            console.log('updating');
            Scores.update({player: winnerId}, {$inc: {score: 1}});
        } else {
            // If winner is not there, insert new score and increment
            console.log('inserting');
            Scores.insert({player: winnerId, score: 1});
        }
    },

    addPlayer: function (playerId) {
        Waiting.insert({player: playerId, timeEntered: Date.now()});
    },

    match: function () {
        // get Waiting sorted
        var waiting = Waiting.find({}, {sort: {timeEntered: 1}}).fetch();

        // get the oldest, remove from Waiting
        var oldest = waiting[0];
        console.log('oldest', oldest);

        Waiting.remove({player: oldest._id});

        // pick random from rest, remove
        var remaining = Waiting.find({}, {sort: {timeEntered: 1}}).fetch();
        var count = waiting.length;
        var randomSelection = remaining[Math.floor(Math.random() * count)];
        Waiting.remove({player: randomSelection._id});
        console.log('randomSelection', randomSelection);

        // create a room with oldest and the random selection
        var room = {player1: oldest._id, player2: randomSelection._id};
        // add it to Rooms
        Rooms.insert(room);
    }

});
