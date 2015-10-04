// Meteor.startup(function() {

//   Meteor.users.remove({});
//   Accounts.createUser({
//     username: "scotchio",
//     email: "scotch@example.com",
//     password: "dummypassword"
//   });

//   Factory.define('message', Messages, {
//     text: function() {
//     	return Fake.sentence();
//     },
//     user: Meteor.users.findOne()._id,
//     timestamp: Date.now()
//   });

//   // Add this if you want to remove all messages before seeding
//   Messages.remove({});

//   if (Messages.find({}).count() === 0) {
//     _(4).times(function(n) {
//       Factory.create('message');
//     });
//   }
// });

Meteor.startup(function() {
    Channels.remove({});
    Channels.insert({
        name: "general"
    });
    Channels.insert({
        name: "random"
    });

    Factory.define('message', Messages, {
        text: function() {
            return Fake.sentence();
        },
        user: Meteor.users.findOne()._id,
        timestamp: Date.now(),
        channel: 'general'
    });

    Meteor.call('testRive', function () {
        var RiveScript = Meteor.npmRequire('rivescript');
        var rs = new RiveScript();

        var reply = Async.runSync(function (done) {
            rs.loadDirectory("/Users/blainenelson/projects/vk/lib/brain",
                             function(batch_num) {
                                 console.log('### loading');
                                 rs.sortReplies();
                                 var reply = rs.reply("local-user", "Hello, bot!");
                                 console.log("The bot says: " + reply);
                                 done(null, reply);
                             });
        });

        return reply.result;
    });
});
