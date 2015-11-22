var casper = require('casper').create({
    verbose: true,
    logLevel: "debug",
    userAgent: 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.2 Safari/537.36'
});

casper.options.viewportSize = {width: 700, height: 600};

var username = casper.cli.get("username");

casper.start('http://localhost:3000');

casper.wait(1000);

casper.then(function () {
    // if logged in, log out before logging in
    this.capture('catpure.png');
    if (this.exists('#login-name-link')) {
        this.echo('==== found #login-name-link');
        this.click('#login-name-link');
        this.waitForSelector('#login-buttons-logout', function () {
            this.click('#login-buttons-logout');
            this.capture('afterLogout.png');
        });
    }
});

casper.then(function () {
    this.waitForSelector('#login-sign-in-link', function () {
        this.echo('==== found #login-sign-in-link');
        this.click('#login-sign-in-link');
    });
});

casper.then(function() {
    this.echo('==== going to wait for username/password field');
    this.waitForSelector('#login-buttons-password', function () {
        this.echo('==== See #login-buttons-password');
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
    this.waitForText(username, function () {
        this.echo('==== Found ' + username);
        this.capture('with' + username + '.png');
    });
});

casper.then(function () {
    if ("button[id='#start-button']:enabled") {
        this.echo('==== found enabled start button');
        this.click('#start-button');
    }
});


casper.then(function () {
    this.waitForText("Waiting", function () {
        this.echo('==== Found Waiting');
        this.capture('foundWaiting.png');
    });
});


casper.then(function () {
    //this.waitForSelector("button[id='#join-button']:enabled", function () {
    this.waitForSelector("#join-button", function () {
        this.echo('==== found join button');
        this.click('#join-button');
        this.capture('join1.png');
    });
});

casper.then(function () {
    this.waitForText("Game ends in",
                     function () {
                         this.echo('==== Found Game ends in');
                         this.click('#bot-button');
                         this.capture('score1.png');
                     },
                     function () {
                         this.echo('==== Cannot find Game ends in');
                         this.capture('errorScore1.png');
                     },
                     6000);
});

casper.run();
