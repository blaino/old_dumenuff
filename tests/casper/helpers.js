var waitForTextTime = 5000;
var waitAndClickTime = 5000;

module.exports = {
    waitAndClick: function(selector, casper) {
        var username = casper.cli.get("username");
        casper.waitForSelector(
            selector,
            function () {
                casper.echo('++++ Found ' + selector + ' for ' + username);
                casper.click(selector);
            },
            function () {
                casper.echo("---- Can't find " + selector + ' for ' + username);
                casper.capture('no' + selector + 'For' + username + '.png');
            },
            waitAndClickTime
        );
    },
    checkForText: function (text, casper) {
        var username = casper.cli.get("username");
        casper.waitForText(
            text,
            function () {
                casper.echo('++++ Found ' + text + ' for ' + username);
                casper.test.assertTextExists(text);
            },
            function () {
                casper.echo("---- Can't find  " + text + ' for ' + username);
                casper.capture('no' + text + 'For' + username + '.png');
            },
            waitForTextTime
        );
    },
    checkForSelector: function(selector, casper) {
        casper.waitForSelector(
            selector,
            function () {
                casper.echo('++++ Found ' + selector);
                casper.test.assertExists(selector);
                casper.capture(selector + '.png');
            },
            function () {
                casper.echo("---- Can't find " + selector);
                casper.capture('no' + selector + '.png');
            },
            10000
        );
    }
};
