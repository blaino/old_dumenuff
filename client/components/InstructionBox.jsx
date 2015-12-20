const {
    Card,
    CardText,
    CardTitle,
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
        Meteor.subscribe('scores');
        Meteor.subscribe('allUsernames');
        return {
            game: Game.findOne({}),
            playerInWaiting: Waiting.findOne({player: Meteor.userId()}),
            scores: Scores.find({}, {sort: {score: -1}}).fetch(),
            allUsernames: Meteor.users.find({}, {fields: {
  	        "username": 1,
                "_id": 1
            }}).fetch(),
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
        );
    },

    renderInstructions() {
        return [
            <CardTitle key="{0}"
                       title="Instructions"/>,
            <CardText key="{1}">
                Chat with your opponent. If you think your opponent is a
                bot click the bot button. If you think your oppoent is a
                human click the human button. You get 1 point if you're
                right; you'll lose 2 if you're wrong. If you fool your
                opponent, you get 2 points.
            </CardText>
        ];
    },

    renderLeaders() {
        return this.data.scores.map((score) => {
            var player = this.data.allUsernames.find(x => x._id == score.player);
            var name = player ? player.username : score.player;
            var line = name + ": " + score.score;
            return [
                <ListItem key={ score._id }
                          primaryText={line}/>,
            ];
        });
    },

    renderLeaderBoard() {
        return [
            <CardTitle key="{0}"
                       title="Leader Board"/>,
            <CardText key="{1}">
                {this.renderLeaders()}
            </CardText>
        ];
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
            <Card>
                {renderFunction()}
            </Card>
        );
    }
});
