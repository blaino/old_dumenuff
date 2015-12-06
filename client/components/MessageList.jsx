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

    componentDidUpdate: function() {
        var node = this.getDOMNode();
        node.scrollTop = node.scrollHeight;
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
