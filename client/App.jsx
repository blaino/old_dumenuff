// App component - represents the whole app
App = React.createClass({

    // This mixin makes the getMeteorData method work
    mixins: [ReactMeteorData],

    // Loads items from the Tasks collection and puts them on this.data.tasks
    getMeteorData() {
        return {
            game: Game.findOne({}),
            playerInWaiting: Waiting.findOne({player: Meteor.userId()}),
        }
    },
    /* getInitialState() {}, */

    gameState: function () {
        var game = this.data.game;
        if (game) {
            var waitingFor = game.numPlayers - game.numReady;
            var state = game.state;
            if (state == "Readying") {
                return "Game starts in " + game.readyTime + " seconds";
            } else if (state == "Started") {
                if (Meteor.userId()) {
                    Meteor.call('findRoom', Meteor.userId(), function (error, room) {
                        if (error) {
                            Session.set('channel', 'lobby');
                        } else {
                            Session.set('channel', room._id);
                        };
                    });
                };
                return "Game ends in " + game.gameTime + " seconds";
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
        var user = Meteor.userId();
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
            <div className="container">
                <header>
                    <h1>dumenuff</h1>
                    <AccountsUIWrapper />
                    <div class="time-remaining">{this.gameState()}</div>


                    <div class="join-button">
                        <button id="join-button"
                                disabled={this.joinButtonDisabled()}
                                onClick={this.clickJoinButton}>
                            Join
                        </button>
                    </div>

                    <div class="start-button">
                        <button id="start-button"
                                disabled={this.startButtonDisabled()}
                                onClick={this.clickStartButton}>
                            Start
                        </button>
                    </div>
                </header>

                <Play/>
            </div>
        );
    }
});
