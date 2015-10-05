Template.footer.events({
    'keypress input': function(e) {
        var inputVal = $('.input-box_text').val();
        if(!!inputVal) {
            var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
            if (charCode == 13) {
                e.stopPropagation();
                var message = $('.input-box_text').val();

                Meteor.call(
                    'newMessage',
                    Meteor.userId(),
                    {
                        text: message,
                        channel: Session.get('channel')
                    }
                );
                $('.input-box_text').val("");


                Meteor.call('reply', message, function (error, result) {
                    if (error) {
                        console.log('error');
                    } else {
                        Meteor.call(
                            'newMessage',
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
