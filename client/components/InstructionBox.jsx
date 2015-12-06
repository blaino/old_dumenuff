const {
    Card,
    CardText,
    List,
    ListItem,
    ListDivider,
} = mui;

const ThemeManager = new mui.Styles.ThemeManager();

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

    childContextTypes: {
        muiTheme: React.PropTypes.object
    },

    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },

    renderTeaser() {
        return (
            <Card>
                <CardText>
                    <ListItem key={0}
                              primaryText="You"
                              secondaryText="Are you a bot?"/>
                    <ListDivider/>
                    <ListItem key={1}
                              primaryText="Player"
                              secondaryText="I know you are but what am i?"/>
                    <ListDivider/>
                    <ListItem key={2}
                              primaryText="You"
                              secondaryText="I think you're a bot."/>
                    <ListDivider/>
                    <ListItem key={3}
                              primaryText="Player"
                              secondaryText="I think you suck"/>
                </CardText>
            </Card>
        );
    },

    renderInstructions() {
        return (
            <Card>
                <CardText>
                    Chat with your opponent. If you think your opponent is a
                    bot click the bot button. If you think your oppoent is a
                    human cilck the human button. You get 1 point if you're
                    right; you'll lose 2 if you're wrong.
                </CardText>
            </Card>
        );
    },

    renderLeaderBoard() {
        return (
            <Card>
                <CardText>
                    <p>Joe won!</p>
                </CardText>
            </Card>
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
