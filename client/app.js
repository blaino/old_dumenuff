Template.messages.helpers({
    messages: Messages.find({}),
});

Template.message.helpers({
    playerName: function (user) {
        if (user && user._id == Meteor.userId()) {
            return user.username;
        } else {
            return "player";
        }
    }
});

Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
});

Template.registerHelper("timestampToTime", function (timestamp) {
    var date = new Date(timestamp);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    return hours + ':' + minutes.substr(minutes.length-2) + ':' + seconds.substr(seconds.length-2);
});

Template.listings.helpers({
    channels: function () {
        return Channels.find();
    },
    buttonsDisabled: function () {
        var game = Game.findOne({});
        if (game) {
            var state = game.state;
            if (state != "Started") {
                return true;
            };
        };

        if (Session.get('channel') == 'lobby') {
            return true;
        }
    },
    joinButtonDisabled: function () {
        var game = Game.findOne({});
        if (game) {
            var state = game.state;
            if (state != "Waiting") {
                return true;
            };
        };

        var playerInWaiting = Waiting.findOne({player: Meteor.userId()});
        if (playerInWaiting) {
            return true;
        }
    },
    startButtonDisabled: function () {
        var game = Game.findOne({});

        if (game) {
            var state = game.state;
            if (state != "Ended") {
                return true;
            };
        };
    }
});

Template.channel.helpers({
    active: function () {
        if (Session.get('channel') === this.name) {
            return "active";
        } else {
            return "";
        }
    }
});

Template.footer.helpers({
    thisPlayersScore: function () {
        var playerScore = Scores.findOne({player: Meteor.userId()});
        var score = 0;
        if (playerScore) {
            score = playerScore.score;
        }
        return score;
    }
});

Template.header.helpers({
    gameState: function () {
        var game = Game.findOne({});
        if (game) {
            var waitingFor = game.numPlayers - game.numReady;
            var state = game.state;
            if (state == "Readying") {
                return "Game starts in " + game.readyTime + " seconds";
            } else if (state == "Started") {
                if (Meteor.userId()) {
                    Meteor.call('findRoom', Meteor.userId(), function (error, room) {
                        if (error) {
                            Session.set('channel', 'lobby');
                        } else {
                            Session.set('channel', room._id);
                        };
                    });
                };
                return "Game ends in " + game.gameTime + " seconds";
            } else if (state == "Ended") {
                return "Game over";
            } else {
                return "Waiting for " + waitingFor + " players";
            }
        } else {
            return "Waiting for x players";
        }
    }
});

// Tracker.autorun(function(){
//     Meteor.call('findRoom', Meteor.userId(), function (error, room) {
//         if (error) {
//             console.log('Error in autorun: ', error);
//             var lobby = Channels.findOne({name: 'lobby'});
//             console.log('lobby', lobby);
//             Session.set('channel', lobby.name);
//         } else {
//             Session.set('channel', room._id);
//         };
//     });
// });

// This is insane, how to simplify or clean?
Tracker.autorun(function() {
    if (Session.get('channel') != 'lobby') {
        if (Math.random() < 0.50) {
            var user = Meteor.userId();
            if (user) {
                Meteor.call('findRoom', user, function (error, room) {
                    if (error) {
                        console.log('autorun, findRoom(): ', error);
                    } else {
                        Meteor.call('getOtherPlayer', user, room, function (error, otherPlayer) {
                            if (error) {
                                console.log('autorun, getOtherPlayer(): ', error);
                            } else {
                                if (otherPlayer == 'bot') {
                                    Meteor.call('reply', 'xxxgreetingxxx', function (error, result) {
                                        if (error) {
                                            console.log('autorun, reply(): ', error);
                                        } else {
                                            Meteor.call('newMessage',
                                                        Meteor.users.findOne({username: "player"}),
                                                        {
                                                            text: result,
                                                            channel: room._id
                                                        });
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            }
        }
    }
});
