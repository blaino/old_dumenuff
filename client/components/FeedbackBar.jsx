FeedbackBar = React.createClass({

    propTypes: {
        scores: React.PropTypes.array.isRequired,
    },

    thisPlayersScore() {
        var playerScore = this.props.scores.find(x => x.player == Meteor.userId());
        var score = 0;
        if (playerScore) {
            score = playerScore.score;
        }
        return score;
    },

    render() {
        var score = this.thisPlayersScore();

        return (
            <div className="feedbackbar">
                <div className="scorebox">
                    <div className="subtitle">Score</div>
                    <div className="scoretext">{score}</div>
                </div>

                <Marquee scores={this.props.scores}/>

                <TimeBox/>
            </div>
        );
    }
});
