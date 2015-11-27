Meteor.startup(function() {

    Meteor.call('cleanUp');

    var readyTime = Meteor.settings.public.readyTime,
        gameTime = Meteor.settings.public.gameTime,
        numPlayers = Meteor.settings.public.numPlayers,
        percentBot = Meteor.settings.public.percentBot;

    Meteor.call('newGame', readyTime, gameTime, numPlayers, percentBot);
});
