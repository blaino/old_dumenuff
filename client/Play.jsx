Play = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        Meteor.subscribe('scores');
        return {
            userId: Meteor.userId(),
            scores: Scores.find({}).fetch(),
        }
    },

    render() {

        Meteor.call('findRoom', this.data.userId, function (error, room) {
            if (error) {
                /* console.log('Cannot find room for: ', this.data.userId); */
                Session.set('channel', 'lobby');
            } else {
                /* console.log('Game starting setting room to: ', room._id); */
                Session.set('channel', room._id);
            };
        });

        return (
            <div className="playpage">
                <FeedbackBar scores={this.data.scores} />

                <MessageList />

                <PlayBar />
            </div>
        );
    }
});
