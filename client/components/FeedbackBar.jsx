const {
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
    ToolbarTitle
} = mui;

const ThemeManager = new mui.Styles.ThemeManager();

FeedbackBar = React.createClass({
    // This mixin makes the getMeteorData method work
    mixins: [ReactMeteorData],

    getMeteorData() {
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
        // Replace later with playing/waiting
        var playingText = Session.get('channel');

        return (
            <div>
                <Toolbar>
                    <ToolbarGroup key={0} float="left">
                        <ToolbarTitle
                            text={scoreText}
                            className="score"/>
                    </ToolbarGroup>
                    <ToolbarGroup key={1}>
                        <ToolbarTitle text={playingText}/>
                    </ToolbarGroup>
                    <ToolbarGroup key={2} float="right">
                        <ToolbarTitle text={timeText} />
                    </ToolbarGroup>
                </Toolbar>
            </div>
        );
    }
});
