Play = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        return {
            userId: Meteor.userId(),
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
                <FeedbackBar />

                <MessageList />

                <PlayBar />
            </div>
        );
    }
});
