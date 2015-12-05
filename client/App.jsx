const {
    RaisedButton
} = mui;

const ThemeManager = new mui.Styles.ThemeManager();

App = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        return {
            game: Game.findOne({}),
        }
    },

    renderSplash() {
        return [
            <h1 className="title">dumenuff</h1>,
            <InstructionBox />,
            <AccountsUIWrapper />,
            <SplashFooter />
        ]
    },

    renderPlay() {
        return <Play />
    },

    render() {
        var game = this.data.game;
        var renderFunction = this.renderSplash;

        if (game) {
            var state = game.state;

            if (state == 'Started') {
                renderFunction = this.renderPlay;
            }
        }

        return (
            <div className="outer">
                {renderFunction()}
            </div>
        );
    }
});
