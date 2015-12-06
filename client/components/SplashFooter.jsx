const {
    RaisedButton
} = mui;

const ThemeManager = new mui.Styles.ThemeManager();

SplashFooter = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        return {
            game: Game.findOne({}),
            playerInWaiting: Waiting.findOne({player: Meteor.userId()}),
            userId: Meteor.userId(),
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

    gameState: function () {
        var game = this.data.game;
        if (game) {
            var waitingFor = game.numPlayers - game.numReady;
            var state = game.state;
            if (state == "Readying") {
                return "Game starts in " + game.readyTime + " seconds";
            } else if (state == "Ended") {
                return "Game over";
            } else {
                return "Waiting for " + waitingFor + " players";
            }
        } else {
            return "Waiting for x players";
        }
    },

    joinButtonDisabled: function () {
        var game = this.data.game;
        if (game) {
            var state = game.state;
            if (state != "Waiting") {
                return true;
            };
        };

        var playerInWaiting = this.data.playerInWaiting;
        if (playerInWaiting) {
            return true;
        }
    },

    startButtonDisabled: function () {
        var game = this.data.game;

        if (game) {
            var state = game.state;
            if (state != "Ended") {
                return true;
            };
        };
    },

    clickJoinButton: function () {
        var user = this.data.userId;
        console.log('Joining user', user);
        if (user) {
            Meteor.call('addPlayer', user);
            Meteor.call('checkReady', function (error, isReady) {
                if (isReady) {
                    Meteor.call('readyGame');
                };
            });
        }
    },

    clickStartButton: function () {
        var readyTime = Meteor.settings.public.readyTime,
            gameTime = Meteor.settings.public.gameTime,
            numPlayers = Meteor.settings.public.numPlayers,
            percentBot = Meteor.settings.public.percentBot;

        Meteor.call('cleanUp');
        Meteor.call('newGame', readyTime, gameTime, numPlayers, percentBot);
    },

    render() {
        return (
            <div className="splashFooter">
                <div className="subtitle">{this.gameState()}</div>

                <RaisedButton
                    disabled={this.joinButtonDisabled()}
                    onClick={this.clickJoinButton}
                    style={{float: "center",
                            margin: "10px"}}
                    label="Join"
                    primary={true}/>

                <RaisedButton
                    disabled={this.startButtonDisabled()}
                    onClick={this.clickStartButton}
                    style={{float: "center",
                            margin: "10px"}}
                    label="Start"
                    primary={true}/>
            </div>
        );
    }
});
