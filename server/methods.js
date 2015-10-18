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

    testMethod: function () {
        console.log('testMethod called');
    }
});
