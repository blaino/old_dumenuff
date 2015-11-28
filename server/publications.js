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
    return Scores.find();
});

Meteor.publish('rooms', function () {
    return Rooms.find();
});

Meteor.publish('game', function () {
    return Game.find();
});

Meteor.publish('waiting', function () {
    return Waiting.find();
});
