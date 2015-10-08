Meteor.startup(function() {
    Messages.remove({});
    Channels.remove({});
    // Meteor.users.remove({});

    Channels.insert({
        name: "general"
    });
    Channels.insert({
        name: "random"
    });

    if (!Meteor.users.findOne({username: "player"})) {
        Accounts.createUser({
            username: "player",
            email: "player@example.com",
            password: "password"
        });
    };

    Meteor.users.update({},
                        {$set: {score: 0}},
                        {multi: true});

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
