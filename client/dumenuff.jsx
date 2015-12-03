if (Meteor.isClient) {
    // This code is executed on the client only

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

    Meteor.startup(function () {
        // Use Meteor.startup to render the component after the page is ready
        React.render(<App />, document.getElementById("render-target"));
    });

    // Greeting
    // This is insane, how to simplify or clean? es6?
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

}
