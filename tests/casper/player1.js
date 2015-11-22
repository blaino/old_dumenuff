var casper = require('casper').create({
    verbose: true,
    logLevel: "debug",
    userAgent: 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.2 Safari/537.36'
});

casper.options.viewportSize = {width: 700, height: 600};

var username = casper.cli.get("username");
var waitAndClickTime = 5000;
var waitForTextTime = 5000;

function waitAndClick(selector, that) {
    that.waitForSelector(
        selector,
        function () {
            that.echo('++++ Found ' + selector);
            that.click(selector);
        },
        function () {
            that.echo("---- Can't find " + selector);
            that.capture('no' + selector + '.png');
        },
        waitAndClickTime
    );
};

function checkForText(text, that) {
    that.waitForText(
        text,
        function () {
            that.echo('++++ Found ' + text);
        },
        function () {
            that.echo("---- Can't find  " + text);
            that.capture('no' + text + '.png');
        },
        waitForTextTime
    );
};


casper.start('http://localhost:3000');

casper.wait(1000);

casper.then(function () {
    // if logged in, log out before logging in
    if (this.exists('#login-name-link')) {
        this.echo('++++ found #login-name-link');
        this.click('#login-name-link');
        waitAndClick('#login-buttons-logout', this);
    }
});

casper.then(function () {
    waitAndClick('#login-sign-in-link', this);
});

casper.then(function() {
    this.echo('++++ going to wait for username/password field');
    this.waitForSelector('#login-buttons-password', function () {
        this.echo('++++ See #login-buttons-password');
    });
});

casper.thenEvaluate(function(username, password) {
    document.querySelector('#login-username-or-email').value = username;
    document.querySelector('#login-password').value = password;
    // This not working:
    //document.querySelector('#login-buttons-password').click();
}, username, 'password');

casper.thenClick('#login-buttons-password');

casper.then(function () {
    checkForText(username, this);
});

casper.then(function () {
    if ("button[id='#start-button']:enabled") {
        this.echo('==== found enabled start button');
        this.click('#start-button');
    }
});

casper.then(function () {
    checkForText("Waiting", this);
});


casper.then(function () {
    waitAndClick('#join-button', this);
});

casper.then(function () {
    checkForText("Game ends in", this);
});


// this.click('#bot-button');

casper.run();
