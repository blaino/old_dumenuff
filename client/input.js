Template.footer.events({
    'keypress input': function(e) {
        var inputVal = $('.input-box_text').val();
        if(!!inputVal) {
            var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
            if (charCode == 13) {
                e.stopPropagation();
                Meteor.call('newMessage', {
                    text: $('.input-box_text').val(),
                    channel: Session.get('channel')
                });
                $('.input-box_text').val("");
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
