const {
    List,
    ListItem,
    ListDivider,
    RaisedButton,
    TextField,
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
    ToolbarTitle
} = mui;

const ThemeManager = new mui.Styles.ThemeManager();

Play = React.createClass({
    // This mixin makes the getMeteorData method work
    mixins: [ReactMeteorData],

    childContextTypes: {
        muiTheme: React.PropTypes.object
    },

    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },

    getMeteorData() {
        return {
            messages: Messages.find({}).fetch(),
            lobby: Channels.findOne({name: 'lobby'}),
            game: Game.findOne({}),
            channel: Channels.findOne({name: Session.get('channel')}),
            rooms: Rooms.find({}).fetch(),
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

        /* var messageText = React.findDOMNode(this.refs.textInput).value.trim(); */
        var messageText = this.refs.textInput.getValue();
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
        this.refs.textInput.setValue("");
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

    renderMessages() {
        return this.data.messages.map((message) => {
            var line = this.playerName(message.user) + ': ' + message.text;
            return [
                <ListItem key={ message._id }
                primaryText={this.playerName(message.user)}
                secondaryText={message.text}/>,


                <ListDivider/>
            ];
        });
    },

    render() {
        return (
            <div>
                <FeedbackBar />

                <ul>
                    {this.renderMessages()}
                </ul>

                <form onSubmit={this.handleSubmit}>
                    <TextField
                        ref="textInput"
                        hintText="Message your opponent"
                        fullWidth={true}/>
                </form>
                <br></br>

                <RaisedButton
                    disabled={this.buttonsDisabled()}
                    onClick={this.clickBotButton}
                    style={{float: "left",
                            margin: "10px"}}
                    label="Bot"
                    primary={true}/>

                <RaisedButton
                    disabled={this.buttonsDisabled()}
                    onClick={this.clickHumanButton}
                    style={{float: "left",
                            margin: "10px"}}
                    label="Human"
                    primary={true}/>

            </div>
        );
    }
});
