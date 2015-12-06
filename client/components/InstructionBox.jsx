InstructionBox = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('game');
        Meteor.subscribe('waiting');
        return {
            game: Game.findOne({}),
            playerInWaiting: Waiting.findOne({player: Meteor.userId()}),
        }
    },

    renderTeaser() {
        return (
            <div className="instructions">
                <p>You: Are you a bot?</p>
                <p>Player: I know you are but what am I?</p>
                <p>You: I think you're a bot.</p>
                <p>Player: I think you suck</p>
            </div>
        );
    },

    renderInstructions() {
        return (
            <div className="instructions">
                <p>Chat with your opponent. If you think your opponent is a
                    bot click the bot button. If you think your oppoent is a
                    human cilck the human button. You get 1 point if you're
                    right; you'll lose 2 if you're wrong.
                </p>
            </div>
        );
    },

    renderLeaderBoard() {
        return (
            <div className="instructions">
                <p>Joe won!</p>
            </div>
        );
    },

    render() {
        var game = this.data.game;
        var renderFunction = this.renderTeaser;

        if (game) {
            var state = game.state;

            if (state == 'Ended') {
                renderFunction = this.renderLeaderBoard;
            } else if (this.data.playerInWaiting) {
                renderFunction = this.renderInstructions;
            }
        }

        return (
            <div>
                {renderFunction()}
            </div>
        );
    }
});
