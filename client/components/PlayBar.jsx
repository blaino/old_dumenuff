const {
    Colors,
    RaisedButton,
    TextField,
} = mui;

const ThemeManager = new mui.Styles.ThemeManager();

PlayBar = React.createClass({
    propTypes: {
        userId: React.PropTypes.string.isRequired,
        sessionChannel: React.PropTypes.string.isRequired,
    },

    childContextTypes: {
        muiTheme: React.PropTypes.object
    },

    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },

    handleSubmit(e) {

        e.preventDefault();

        var messageText = this.refs.textInput.getValue();
        this.refs.textInput.setValue("");
        var userId = this.props.userId;

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

                if (room.player2 == "bot") {
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
    },

    clickBotButton() {
        var that = this;
        Session.set('channel', 'lobby');

        var playerId = this.props.userId;
        var room = Meteor.call('findRoom', playerId, function (error, room) {
            if (error) {
                console.log('click bot: ', error);
            }
            else {
                Meteor.call('scoreAndRematch', playerId, "bot", room);
            }
        });
    },

    clickHumanButton() {
        var that = this;
        Session.set('channel', 'lobby');

        var playerId = this.props.userId;
        var room = Meteor.call('findRoom', playerId, function (error, room) {
            if (error) {
                console.log('click human: ', error);
            }
            else {
                Meteor.call('scoreAndRematch', playerId, "human", room,
                            that.handleWinnerPair);
            }
        });
    },

    render() {
        var isDisabled = (this.props.sessionChannel == 'lobby') ? true : false;

        if (isDisabled) {
            $('.playbar').css('visibility', 'hidden');
        } else {
            $('.playbar').css('visibility', 'visible');
        }

        return (
            <div className="playbar">
                <form onSubmit={this.handleSubmit}>
                    <TextField
                        ref="textInput"
                        hintText="Message your opponent"
                        fullWidth={true}
                    />
                </form>

                <div className="playbarbuttons">

                    <RaisedButton
                        onClick={this.clickBotButton}
                        style={{float: "left",
                                margin: "10px",
                               }}
                        label="Bot"
                        primary={true}/>

                    <RaisedButton
                        onClick={this.clickHumanButton}
                        style={{float: "right",
                                margin: "10px",
                               }}
                        label="Human"
                        primary={true}/>

                </div>
            </div>
        )
    }
})
