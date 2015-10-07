Meteor.publish('messages', function (channel) {
    return Messages.find({channel: channel});
});

Meteor.publish("allUsernames", function () {
    return Meteor.users.find({}, {fields: {
  	"username": 1
    }});
});

Meteor.publish('channels', function () {
    return Channels.find();
});

Meteor.publish('scores', function () {
    if (this.userId) {
        return Meteor.users.find({_id: this.userId},
                                 {fields: {'score': 1}});
    } else {
        this.ready();
    }
});
