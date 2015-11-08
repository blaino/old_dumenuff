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

    Meteor.call('newGame', 5, 300, 2, 50);
    Meteor.call('cleanUp');

});
