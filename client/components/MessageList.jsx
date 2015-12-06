const {
    List,
    ListItem,
    ListDivider,
} = mui;

const ThemeManager = new mui.Styles.ThemeManager();

MessageList = React.createClass({
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
        Meteor.subscribe('messages', Session.get('channel'));
        return {
            messages: Messages.find({}).fetch(),
            userId: Meteor.userId(),
        }
    },

    playerName(user) {
        if (user && user._id == this.data.userId) {
            return user.username;
        } else {
            return "player";
        }
    },

    renderMessages() {
        /* console.log('this.data.messages', this.data.messages); */
        return this.data.messages.map((message) => {
            /* console.log('trying to render message', message); */
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
            <div className="messages">
                <div className="messageLabel">Your conversation:</div>
                <ul>
                    {this.renderMessages()}
                </ul>
            </div>
        )
    }
});
