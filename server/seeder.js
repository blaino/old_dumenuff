Meteor.startup(function() {
    Messages.remove({});
    Channels.remove({});
    Meteor.users.remove({});
    Rooms.remove({});
    Waiting.remove({});

    // Create the user accounts, add the players
    var numPlayers = 4;
    var player;
    for (i = 1; i <= numPlayers; i++) {
        if (!Meteor.users.findOne({username: "seedUser" + i})) {
            Accounts.createUser({
                username: "seedUser" + String(i),
                email: "seedUser" + String(i) + "@example.com",
                password: "password"
            });
            player = Meteor.users.findOne({username: "seedUser" + String(i)});
            Meteor.call('addPlayer', player._id);
        };
    };

    // Match the players in rooms
    var waiting = Waiting.find({}).fetch().length;
    console.log('waiting', waiting);
    while (waiting > 0) {
        Meteor.call('match');
        waiting = Waiting.find({}).fetch().length;
    };

    // Meteor.call('match');

    // Create a chat channel for each room
    var rooms = Rooms.find({});
    rooms.forEach(function (room) {
        console.log('room', room);
        Channels.insert({
            name: room._id
        });
    });




/* BIG INTEG TEST
 addPlayer(a first player)
 addPlayer(a second player)
 match()
 set session channel variable to room id (this may only be a client side thing)
 start the game
 chat
 player chooses bot/human
 updateScore(winning player)
 deMatch()
*/

});
