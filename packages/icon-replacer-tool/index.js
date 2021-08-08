const iconReplacer = require("./src/icon-replacer");
const utils = require("../shared-utils/sharedUtils");

const execute = overrides => {
  const config = utils.loadConfig(overrides);
  utils.init(config);

  const iconFolder = config.iconReplacerTool.iconFolder;
  const iconMappings = config.iconReplacerTool.iconMappings;

  iconReplacer.run(
    config,
    iconFolder,
    iconMappings,
  );

  console.info("icon-replacer-tool finished");
};

module.exports = { execute };
