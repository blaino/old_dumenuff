Meteor.methods({
    newMessage: function (message) {
  	message.timestamp = Date.now();
        message.user = Meteor.userId();
        Messages.insert(message);
    },

    testRive: function () {
        console.log('testing rivescript');
    }
});
