const {
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
    ToolbarTitle
} = mui;

const ThemeManager = new mui.Styles.ThemeManager();

FeedbackBar = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('game');
        Meteor.subscribe('scores');
        return {
            game: Game.findOne({}),
            scores: Scores.find({}).fetch(),
        }
    },

    childContextTypes: {
        muiTheme: React.PropTypes.object
    },

    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },

    thisPlayersScore() {
        var playerScore = this.data.scores.find(x => x.player == Meteor.userId());
        var score = 0;
        if (playerScore) {
            score = playerScore.score;
        }
        return score;
    },

    lastRound() {
        var playerScore = this.data.scores.find(x => x.player == Meteor.userId());
        var lastRoundArr = ["", ""];

        if (playerScore) {
            if (playerScore.result == "right") {
                lastRoundArr[0] = "Right!";
                if (playerScore.opponent == "bot") {
                    lastRoundArr[1] = "You bested a dumb bot. +1";
                } else {
                    lastRoundArr[1] = "You fooled " + playerScore.opponent + ". +1";
                }
            } else {
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
        var score = this.thisPlayersScore();
        var game = this.data.game;
        var time = "0";
        if (game) {
            time = game.gameTime;
        }
        var lastRoundArr = this.lastRound();

        return (
            <div className="feedbackbar">
                <div className="scorebox">
                    <div className="subtitle">Score</div>
                    <div className="scoretext">{score}</div>
                </div>
                <div className="marquee">
                    <div className="marqueetext">{lastRoundArr[0]}</div>
                    <div className="marqueetext">{lastRoundArr[1]}</div>
                </div>
                <div className="timebox">
                    <div className="marqueetext">Time</div>
                    <div className="marqueetext">{time}s</div>
                </div>
            </div>
        );
    }
});
