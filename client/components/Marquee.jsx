Marquee = React.createClass({

    propTypes: {
        scores: React.PropTypes.array.isRequired,
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

        {/*
        $('.marqueetext').css('visibility', 'visible');
        setTimeout(function () {
            $('.marqueetext').css('visibility', 'hidden');
        }, 4000);
        */}

        return (
            <div className="marquee">
                <div className="marqueetext">{lastRoundArr[0]}</div>
                <div className="marqueetext">{lastRoundArr[1]}</div>
            </div>
        );
    }
});
