const {
    RaisedButton
} = mui;

const ThemeManager = new mui.Styles.ThemeManager();

App = React.createClass({

    renderFooter() {
        var user = Meteor.userId();
        return [
            <AccountsUIWrapper />,
            <SplashFooter />
        ]
    },

    render() {
        return (
            <div className="outer">

                <h1 className="title">dumenuff</h1>

                <InstructionBox />

                {this.renderFooter()}

                <div className="splashFooter">
                    <p>--------- Next Page -------</p>
                </div>

                <Play/>
            </div>
        );
    }
});
