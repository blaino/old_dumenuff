Meteor.subscribe('channels');

Meteor.subscribe('rooms');

Meteor.subscribe('allUsernames');

Meteor.subscribe('scores');

Meteor.subscribe('game');

Meteor.subscribe('waiting');

Template.messages.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('messages', Session.get('channel'));
  });
});
