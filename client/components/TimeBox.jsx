TimeBox = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('time');
        return {
            time: Time.findOne({}),
        }
    },

    render() {
        var gameTime = "0";
        var time = this.data.time;
        if (time) {
            gameTime = time.gameTime;
        }

        return (
            <div className="timebox">
                <div className="timetext">Time</div>
                <div className="timetext">{gameTime}s</div>
            </div>
        );
    }
});
