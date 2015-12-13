TimeBox = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('game');
        return {
            game: Game.findOne({}),
        }
    },

    render() {
        var time = "0";
        var game = this.data.game;
        if (game) {
            time = game.gameTime;
        }

        return (
            <div className="timebox">
                <div className="timetext">Time</div>
                <div className="timetext">{time}s</div>
            </div>
        );
    }
});
