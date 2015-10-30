Meteor.startup(function() {

    Meteor.call('cleanUp');
    Meteor.call('addStartingPlayers', 4);
    Meteor.call('matchPlayers', 50);
    Meteor.call('createChannels');
    Meteor.call('postMessages');


    /* Integ test
     set session channel variable somehow (not for this test)
     x chat
     player chooses bot/human
     updateScore(winning player)
     */

});
