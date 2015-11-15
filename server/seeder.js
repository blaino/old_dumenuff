Meteor.startup(function() {

    // var man1 = Meteor.users.findOne({username: "man1"});
    // if (!man1) {
    //     Accounts.createUser({
    //         username: "man1",
    //         email: "man1@man.com",
    //         password: "password"
    //     });
    // }

    // var man2 = Meteor.users.findOne({username: "man2"});
    // if (!man1) {
    //     Accounts.createUser({
    //         username: "man2",
    //         email: "man2@man.com",
    //         password: "password"
    //     });
    // }

    var readyTime = 5,
        gameTime = 300,
        numPlayers = 4,
        percentBot = 50;

    Meteor.call('newGame', readyTime, gameTime, numPlayers, percentBot);
    Channels.insert({name: "lobby"});

    // Do you really need to go nuclear here:
    Meteor.call('cleanUp');

});
