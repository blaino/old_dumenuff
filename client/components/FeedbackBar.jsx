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

    render() {
        var scoreText = "Score: " + this.thisPlayersScore();
        var game = this.data.game;
        var timeText = "Time: ";
        if (game) {
            timeText = "Time: " + game.gameTime + "s";
        }

        var playingText = (Session.get('channel') == "lobby") ? "Waiting" : "Playing";

        return (
            <div className="feedbackbar">
                <Toolbar>
                    <ToolbarGroup key={0} float="left">
                        <ToolbarTitle
                            text={scoreText}
                            className="score"/>
                    </ToolbarGroup>
                    <ToolbarGroup key={1}>
                        <ToolbarTitle text={playingText}
                                      className="toolbartitle"
                        />
                    </ToolbarGroup>
                    <ToolbarGroup key={2} float="right">
                        <ToolbarTitle text={timeText} />
                    </ToolbarGroup>
                </Toolbar>
            </div>
        );
    }
});
