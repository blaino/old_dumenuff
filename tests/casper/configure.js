function configureCasper(casper) {
    casper.options.pageSettings = {
        loadImages:  true,
        loadPlugins: true
    };
    casper.options.verbose = false;
    casper.options.logLevel = "warning"; // More debug available with turnOnDebug() in debug.js
    casper.options.viewportSize = {width: 700, height: 600};
};

module.exports = configureCasper;
