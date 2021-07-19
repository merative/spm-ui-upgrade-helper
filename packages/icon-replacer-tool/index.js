const iconReplacer = require("./src/icon-replacer");
const utils = require("../shared-utils/sharedUtils");

const execute = (overrides = {}) => {
  const config = { ...utils.loadConfig(), ...overrides };
  utils.init(config);

  const iconFolder = overrides.iconFolder || "/home/theia/packages/icon-replacer-tool/source_files";
  const iconMappings = overrides.iconMappings || "/home/theia/packages/icon-replacer-tool/icon_mappings.json";

  iconReplacer.run(
    config,
    iconFolder,
    iconMappings,
  );
};

module.exports = { execute };
