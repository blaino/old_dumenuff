Meteor.startup(function() {

    var readyTime = Meteor.settings.public.readyTime,
        gameTime = Meteor.settings.public.gameTime,
        numPlayers = Meteor.settings.public.numPlayers,
        percentBot = Meteor.settings.public.percentBot;

    Meteor.call('newGame', readyTime, gameTime, numPlayers, percentBot);
    Channels.insert({name: "lobby"});

    // Do you really need to go nuclear here:
    Meteor.call('cleanUp');

});
