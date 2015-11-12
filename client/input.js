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
                    if (!error) {
                        console.log('room', room);
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
                                    console.log('error');
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

// TODO: get rid of this
Template.channel.events({
    'click .channel': function (e) {
        console.log('got channel click');
        Session.set('channel', this.name);
    }
});

Template.listings.events({
    'click #bot-button': function () {
        var lobby = Channels.findOne({name: 'lobby'});
        Session.set('channel', lobby.name);

        Meteor.call('scoreAndRematch', Meteor.userId(), "bot");
    },
    'click #human-button': function () {
        var lobby = Channels.findOne({name: 'lobby'});
        Session.set('channel', lobby.name);

        Meteor.call('scoreAndRematch', Meteor.userId(), "human");
    }
});
