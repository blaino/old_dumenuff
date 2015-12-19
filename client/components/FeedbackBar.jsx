FeedbackBar = React.createClass({

    propTypes: {
        score: React.PropTypes.object.isRequired,
    },

    render() {
        var score = this.props.score ? this.props.score.score : 0;

        return (
            <div className="feedbackbar">
                <div className="scorebox">
                    <div className="scoreheading">Score</div>
                    <div className="scoretext">{score}</div>
                </div>
                <Marquee score={this.props.score}/>
                <TimeBox />
            </div>
        );
    }
});
