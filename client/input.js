Template.footer.events({
    'keypress input': function(e) {
        var inputVal = $('.input-box_text').val();
        if(!!inputVal) {
            var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
            if (charCode == 13) {
                e.stopPropagation();
                var messageText = $('.input-box_text').val();
                var userId = Meteor.userId();

                Meteor.call('findRoom', userId, function (error, room) {
                    if (error) {
                        console.log('keypress input, findRoom(): ', error);
                    } else {
                        Meteor.call(
                            'newMessage',
                            // Human
                            Meteor.users.findOne({_id: userId}),
                            {
                                text: messageText,
                                channel: room._id
                            }
                        );

                        $('.input-box_text').val("");

                        if (room.player2 == "bot") {
                            // TODO: pull out into a function???
                            Meteor.call('reply', messageText, function (error, result) {
                                if (error) {
                                    console.log('keypress input, reply(): ', error);
                                } else {
                                    Meteor.call(
                                        'newMessage',
                                        // Bot
                                        Meteor.users.findOne({username: "player"}),
                                        {
                                            text: result,
                                            channel: room._id
                                        }
                                    );
                                }
                            });
                        };
                    };
                });

                return false;
            }
        }
    },
    'keyup input': function(event) {
        var objDiv = $('.message-history')[0];
        objDiv.scrollTop = objDiv.scrollHeight;
    }
});

Template.listings.events({
    'click #bot-button': function () {
        console.log('****** Trying to click');
        var lobby = Channels.findOne({name: 'lobby'});
        Session.set('channel', lobby.name);

        var playerId = Meteor.userId();
        var room = Meteor.call('findRoom', playerId, function (error, room) {
            if (error) {
                console.log('click bot: ', error);
            }
            else {
                console.log('****** clicking', playerId, room._id);
                Meteor.call('scoreAndRematch', playerId, "bot", room);
            }
        });
    },
    'click #human-button': function () {
        var lobby = Channels.findOne({name: 'lobby'});
        Session.set('channel', lobby.name);

        var playerId = Meteor.userId();
        var room = Meteor.call('findRoom', playerId, function (error, room) {
            if (error) {
                console.log('click human: ', error);
            }
            else {
                Meteor.call('scoreAndRematch', playerId, "human", room);
            }
        });
    },
    'click #join-button': function () {
        var user = Meteor.userId();
        if (user) {
            Meteor.call('addPlayer', user);
            Meteor.call('checkReady', function (error, isReady) {
                if (isReady) {
                    Meteor.call('readyGame');
                };
            });
        }
    },
    'click #start-button': function () {
        var readyTime = Meteor.settings.public.readyTime,
            gameTime = Meteor.settings.public.gameTime,
            numPlayers = Meteor.settings.public.numPlayers,
            percentBot = Meteor.settings.public.percentBot;

        Meteor.call('cleanUp');
        Meteor.call('newGame', readyTime, gameTime, numPlayers, percentBot);
    }
});
