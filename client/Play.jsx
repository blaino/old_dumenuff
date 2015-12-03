Play = React.createClass({
    // This mixin makes the getMeteorData method work
    mixins: [ReactMeteorData],

    //propTypes: {
        // This component gets the task to display through a React prop.
        // We can use propTypes to indicate it is required
    //        task: React.PropTypes.object.isRequired
    //},

    getMeteorData() {
        return {
            messages: Messages.find({}).fetch(),
            lobby: Channels.findOne({name: 'lobby'}),
            game: Game.findOne({}),
            channel: Channels.findOne({name: Session.get('channel')}),
            rooms: Rooms.find({}).fetch(),
            scores: Scores.find({}).fetch(),
        }
    },

    playerName(user) {
        if (user && user._id == Meteor.userId()) {
            return user.username;
        } else {
            return "player";
        }
    },

    handleSubmit(e) {
        e.preventDefault();

        var messageText = React.findDOMNode(this.refs.textInput).value.trim();
        var userId = Meteor.userId();

        console.log('messageText', messageText);


        Meteor.call('findRoom', userId, function (error, room) {
            if (error) {
                console.log('handleSubmit, findRoom(): ', error);
            } else {
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
                            console.log('keypress input, reply(): ', error);
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
        React.findDOMNode(this.refs.textInput).value = "";
    },

    clickBotButton() {
        console.log('****** Trying to click');
        var lobby = this.data.lobby;
        Session.set('channel', lobby.name);

        var playerId = Meteor.userId();
        var room = Meteor.call('findRoom', playerId, function (error, room) {
            if (error) {
                console.log('click bot: ', error);
            }
            else {
                console.log('****** clicking', playerId, room._id);
                Meteor.call('scoreAndRematch', playerId, "bot", room);
            }
        });
    },

    clickHumanButton() {
        var lobby = this.data.lobby;
        Session.set('channel', lobby.name);

        var playerId = Meteor.userId();
        var room = Meteor.call('findRoom', playerId, function (error, room) {
            if (error) {
                console.log('click human: ', error);
            }
            else {
                Meteor.call('scoreAndRematch', playerId, "human", room);
            }
        });
    },

    buttonsDisabled() {
        var game = this.data.game;
        if (game) {
            var state = game.state;
            if (state != "Started") {
                return true;
            }
        };

        if (Session.get('channel') == 'lobby') {
            return true;
        }

        var channel = this.data.channel;
        if (channel) {
            var channelName = channel.name;
            var room = this.data.rooms.find(x => x._id == channelName);
            if (room) {
                var minChatTime = Meteor.settings.public.minChatTime * 1000;
                if ((Date.now() - room.liveTime) < minChatTime) {
                    return true;
                }
            }
        }
    },

    thisPlayersScore() {
        var playerScore = this.data.scores.find(x => x.player == Meteor.userId());
        var score = 0;
        if (playerScore) {
            score = playerScore.score;
        }
        return score;
    },

    renderMessages() {
        return this.data.messages.map((message) => {
            // console.log('message in renderMessages', message);
            return (
                <li>
                    <span>
                        {this.playerName(message.user)}: {message.text}
                    </span>
                </li>
            );
        });
    },

    render() {
        return (
            <div>
                <span>{Session.get('channel')}</span>
                <ul>
                    {this.renderMessages()}
                </ul>
                <form className="input-box_text" onSubmit={this.handleSubmit} >
                    <input
                        type="text"
                        ref="textInput"
                        placeholder="Type your message here" />
                </form>
                <br></br>
                <div className="buttons">
                    <button onClick={this.clickBotButton}
                            disabled={this.buttonsDisabled()}>
                        Bot
                    </button>
                    <button onClick={this.clickHumanButton}
                            disabled={this.buttonsDisabled()}>
                        Human
                    </button>
                </div>
                <br></br>
                <div>
                    <span>score</span>
                    <span>{this.thisPlayersScore()}</span>
                </div>

            </div>
        );
    }
});
