Play = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('scores');
        Meteor.subscribe('rooms');
        return {
            userId: Meteor.userId(),
            score: Scores.findOne({player: Meteor.userId()}),
            sessionChannel: Session.get('channel'),
            room: Rooms.findOne({ $or: [ {player1: Meteor.userId()}, {player2: Meteor.userId()} ]})
        }
    },

    render() {
        if (this.data.room) {
            var room = this.data.room;
            Session.set('channel', room._id);
        } else {
            Session.set('channel', 'lobby');
        }

        return (
            <div className="playpage">
                <FeedbackBar score={this.data.score} />

                <MessageList />

                <PlayBar sessionChannel={this.data.sessionChannel}
                         userId={this.data.userId}/>

                <WaitingBar sessionChannel={this.data.sessionChannel}/>
            </div>
        );
    }
});
