Meteor.startup(function() {

    Meteor.call('newGame', 10, 100, 2, 50);
    Meteor.call('cleanUp');
    // Meteor.call('addStartingPlayers', 4);
    // Meteor.call('matchPlayers', 50);
    // Meteor.call('postMessages');

    /* Integ test
     set session channel variable somehow (not for this test)
     x chat
     player chooses bot/human
     updateScore(winning player)
     */

});
