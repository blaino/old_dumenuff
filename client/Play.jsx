const {
    List,
    ListItem,
    ListDivider,
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
        }
    },

    playerName(user) {
        if (user && user._id == Meteor.userId()) {
            return user.username;
        } else {
            return "player";
        }
    },

    renderMessages() {
        return this.data.messages.map((message) => {
            console.log('trying to render message', message);
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

        Meteor.call('findRoom', Meteor.userId(), function (error, room) {
            if (error) {
                /* console.log('Cannot find room for: ', Meteor.userId()); */
                Session.set('channel', 'lobby');
            } else {
                /* console.log('Game starting setting room to: ', room._id); */
                Session.set('channel', room._id);
            };
        });

        return (
            <div>
                <FeedbackBar />

                <div className="messages">
                    <div className="messageLabel">Your conversation:</div>
                    <ul>
                       {this.renderMessages()}
                   </ul>
                </div>

                <PlayBar />
            </div>
        );
    }
});
