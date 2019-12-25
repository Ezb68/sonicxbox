var command = {
  command: 'init',
  description: 'Initialize new and empty sonicxBox project',
  builder: {},
  run: function (options, done) {
    process.env.CURRENT = 'init'
    var Config = require("../../components/Config");
    var OS = require("os");
    var UnboxCommand = require("./unbox");

    var config = Config.default().with({
      logger: console
    });

    if (options._ && options._.length > 0) {
      config.logger.log(
        "Error: `sonicxbox init` no longer accepts a project template name as an argument."
      );
      config.logger.log();
      config.logger.log(
        " - For an empty project, use `sonicxbox init` with no arguments" +
        OS.EOL +
        " - Or, browse the sonicxbox Boxes at <http://sonicxboxframework.com/boxes>!"
      );
      process.exit(1);
    }

    // defer to `truffle unbox` command with "bare" box as arg
    var url = "https://github.com/sonicxbox-boxes/bare-box.git";
    options._ = [url];

    UnboxCommand.run(options, done);
  }
}

module.exports = command;
