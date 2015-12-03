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
                console.log('keypress input, findRoom(): ', error);
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

    renderMessages() {
        return this.data.messages.map((message) => {
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
                <ul>
                    {this.renderMessages()}
                </ul>

                <form className="input-box_text" onSubmit={this.handleSubmit} >
                    <input
                        type="text"
                        ref="textInput"
                        placeholder="Type your message here" />
                </form>
            </div>
        );
    }
});
