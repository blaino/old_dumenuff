WaitingBar = React.createClass({
    propTypes: {
        sessionChannel: React.PropTypes.string,
    },

    render() {
        var that = this;
        setTimeout(function () {
            if (that.props.sessionChannel == 'lobby') {
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
