var command = {
  command: 'create',
  description: 'Helper to create new contracts, migrations and tests',
  builder: {
    all: {
      type: "boolean",
      default: false
    },
    force: {
      type: "boolean",
      default: false
    }
  },
  run: function (options, done) {
    process.env.CURRENT = 'create'
    var Config = require("../../components/Config");
    var ConfigurationError = require("../errors/configurationerror");
    var create = require("../create");

    var config = Config.detect(options);

    var type = config.type;

    if (type == null && config._.length > 0) {
      type = config._[0]
    }

    var name = config.name;

    if (name == null && config._.length > 1) {
      name = config._[1];
    }

    if (type == null) {
      return done(new ConfigurationError("Please specify the type of item to create. Example: sonicxbox create contract MyContract"));
    }

    if (name == null) {
      return done(new ConfigurationError("Please specify the name of item to create. Example: sonicxbox create contract MyContract"));
    }

    if (!/^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(name)) {
      return done(new ConfigurationError("The name " + name + " is invalid. Please enter a valid name using alpha-numeric characters."));
    }

    var fn = create[type];

    if (fn == null) return done(new ConfigurationError("Cannot find creation type: " + type));

    var destinations = {
      "contract": config.contracts_directory,
      "migration": config.migrations_directory,
      "test": config.test_directory
    };

    create[type](destinations[type], name, options, done);
  }
}

module.exports = command;
