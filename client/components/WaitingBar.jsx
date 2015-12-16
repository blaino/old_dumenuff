WaitingBar = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        return {
            sessionChannel: Session.get('channel'),
        }
    },

    render() {
        var that = this;
        setTimeout(function () {
            if (that.data.sessionChannel == 'lobby') {

                $('.waitingbar').css('visibility', 'visible');

            } else {
                $('.waitingbar').css('visibility', 'hidden');
            }
        }, 1000);

        return (
            <div className="waitingbar">
                <div className="waitingbartext">Waiting for perfect match</div>
            </div>
        )
    }
});
