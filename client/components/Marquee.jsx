Marquee = React.createClass({

    propTypes: {
        scores: React.PropTypes.array.isRequired,
    },

    getInitialState() {
        return {
            score: null,
            justFinished: false
        };
    },

    componentWillUpdate() {
        var playerScore = this.props.scores.find(x => x.player == Meteor.userId());

        if (playerScore.score !== this.state.score) {
            this.setState({score: playerScore.score});
            this.setState({justFinished: true});
        }
    },

    lastRound() {
        var playerScore = this.props.scores.find(x => x.player == Meteor.userId());
        var lastRoundArr = ["", ""];

        if (playerScore) {
            if (playerScore.result == "right") {
                lastRoundArr[0] = "Right!";
                if (playerScore.opponent == "bot") {
                    lastRoundArr[1] = "You bested a dumb bot. +1";
                } else {
                    lastRoundArr[1] = "You fooled " + playerScore.opponent + ". +1";
                }
            } else if (playerScore.result == "wrong") {
                lastRoundArr[0] = "Wrong!";
                if (playerScore.opponent == "bot") {
                    lastRoundArr[1] = "A dumb bot fooled you. -2";
                } else {
                    lastRoundArr[1] = playerScore.opponent + " fooled you. -2";
                }
            }
        }
        return lastRoundArr;
    },

    render() {
        var lastRoundArr = this.lastRound();

        if (this.state.justFinished) {
            var playerScore = this.props.scores.find(x => x.player == Meteor.userId());

            if (playerScore.result == "right") {
                $('.feedbackbar').css('background-color', '#6C4');
            } else if (playerScore.result == "wrong") {
                $('.feedbackbar').css('background-color', 'red');
            }

            $('.marqueetext').css('visibility', 'visible');
            this.setState({justFinished: false});

            setTimeout(function () {
                $('.marqueetext').css('visibility', 'hidden');
                $('.feedbackbar').css('background-color', '#DDD');
            }, 4000);
        }

        return (
            <div className="marquee">
                <div className="marqueetext">{lastRoundArr[0]}</div>
                <div className="marqueetext">{lastRoundArr[1]}</div>
            </div>
        );
    }
});
