var command = {
  command: 'console',
  description: 'Run a console with contract abstractions and commands available',
  builder: {},
  run: function (options, done) {
    process.env.CURRENT = 'console'
    var Config = require("../../components/Config");
    var Console = require("../console");
    var Environment = require("../environment");
    var TruffleError = require("@truffle/error");

    var SonicXWrap = require("../../components/SonicXWrap");
    const logErrorAndExit = require('../../components/SonicXWrap').logErrorAndExit

    var config = Config.detect(options);

    if (!config.network && config.networks.development) {
      config.network = "development";
    }
    // init SonicXWeb
    try {
      SonicXWrap(config.networks[config.network], {
        verify: true,
        log: options.log
      })
    } catch(err) {
      logErrorAndExit(console, err.message)
    }

    // This require a smell?
    var commands = require("./index")
    var excluded = [
      "console",
      "init",
      "watch",
      "serve"
    ];

    var available_commands = Object.keys(commands).filter(function(name) {
      return excluded.indexOf(name) == -1;
    });

    var console_commands = {};
    available_commands.forEach(function(name) {
      console_commands[name] = commands[name];
    });

    Environment.detect(config, function(err) {
      if (err) return done(err);

      var c = new Console(console_commands, config.with({
        noAliases: true
      }));
      c.start(done);
    });
  }
}

module.exports = command;
