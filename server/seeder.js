Meteor.startup(function() {
    Messages.remove({});

    Channels.remove({});
    Channels.insert({
        name: "general"
    });
    Channels.insert({
        name: "random"
    });

    //Meteor.users.remove({});

    // Accounts.createUser({
    //     username: "player",
    //     email: "player@example.com",
    //     password: "password"
    // });

    // Factory.define('message', Messages, {
    //     text: "I'm a message from player, a greeting perhaps randomly",
    //     user: Meteor.users.findOne({
    //         username: "player"
    //     })._id,
    //     timestamp: Date.now(),
    //     channel: 'general'
    // });

    // Factory.create('message');

    // Factory.define('message', Messages, {
    //     text: function() {
    //         return Fake.sentence();
    //     },
    //     user: Meteor.users.findOne()._id,
    //     timestamp: Date.now(),
    //     channel: 'general'
    // });
});
