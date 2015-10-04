Meteor.methods({
    newMessage: function (message) {
  	message.timestamp = Date.now();
        message.user = Meteor.userId();
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
    }
});
