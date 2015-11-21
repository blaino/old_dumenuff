var casper = require('casper').create({
    verbose: true,
    logLevel: "debug",
    userAgent: 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.2 Safari/537.36'
});

casper.start('http://localhost:3000');


casper.then(function () {
    // if logged in, log out before logging in
    if (this.exists('#login-name-link')) {
        this.click('#login-name-link');
    } else if (this.exists('#login-sign-in-link')) {
        this.click('#login-sign-in-link');
    } else {
        this.echo('neither #login-name-link nor #login-sign-in-link found, capturing');
        this.capture('sign-in-error.png');
    }
});

casper.then(function() {
    this.waitForSelector('#login-buttons-password', function () {
        this.echo('See #login-buttons-password');
    });
});

casper.thenEvaluate(function(username, password) {
    document.querySelector('#login-username-or-email').value = username;
    document.querySelector('#login-password').value = password;
    // This not working:
    //document.querySelector('#login-buttons-password').click();
}, 'gunnar', 'password');

casper.thenClick('#login-buttons-password');

casper.then(function () {
    this.capture('capture.png');

    this.waitForText("gunnar", function () {
        this.echo('Found gunnar');
        this.capture('withGunnar.png');
    });
});


casper.run();
