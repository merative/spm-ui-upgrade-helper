const fileio = require("@folkforms/file-io");
const utils = require("../shared-utils/sharedUtils");

/**
 * Main method. Will be called via http://localhost:4000/execute
 *
 * @param {*} testConfigOverrides used for testing
 * @param {*} testToolOverrides used for testing
 */
const execute = (testConfigOverrides = {}, testToolOverrides = []) => {
  try {
    // Load configuration (and apply any test overrides provided)
    const config = { ...utils.loadConfig(), ...testConfigOverrides };
    const tools = testToolOverrides.length > 0 ? testToolOverrides : fileio.readJson("../../config/tools.json");

    // Init the output folder and set config.files
    utils.init(config);

    // Pass configuration to the individual tools so we can tell them to skip the init step
    const configOverrides = { ...config, skipInit: true };

    // Execute all the tools
    tools.forEach(tool => {
      if(tool.package === "main-tool") { return; } // Skip main tool

      if(tool.enabled) {
        console.info(`==== Running tool '${tool.package}' ====`);
        const toolIndexFile = require(`../${tool.package}/index`);
        toolIndexFile.execute(configOverrides);
      }
    });

  } catch (error) {
    console.error(error);
    return 1;
  }

  console.info("====");
  console.info("All done!");
}

module.exports = { execute };
