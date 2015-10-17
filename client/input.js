Template.footer.events({
    'keypress input': function(e) {
        var inputVal = $('.input-box_text').val();
        if(!!inputVal) {
            var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
            if (charCode == 13) {
                e.stopPropagation();
                var messageText = $('.input-box_text').val();

                Meteor.call(
                    'newMessage',
                    // Human
                    Meteor.users.findOne({_id: Meteor.userId()}),
                    {
                        text: messageText,
                        channel: Session.get('channel')
                    }
                );
                $('.input-box_text').val("");


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
                                channel: Session.get('channel')
                            }
                        );
                    }
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

Template.channel.events({
    'click .channel': function (e) {
        console.log('got channel click');
        Session.set('channel', this.name);
    }
});

Template.listings.events({
    'click #bot-button': function () {
        console.log('bot button clicked');
    },
    'click #human-button': function () {
        console.log('human button clicked');
    }
});
