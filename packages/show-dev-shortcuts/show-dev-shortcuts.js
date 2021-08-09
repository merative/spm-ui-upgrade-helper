/**
 * If run with "true" as an argument will modify ../plugins/package.json to include shortcuts for
 * all known tools, regardless of whether they are enabled or not.
 *
 * Note that the paths used here are different due to how the Dockerfile builds the code.
 */
const { program } = require("commander");
const utils = require("../shared-utils/sharedUtils");
const jsonFormat = require("json-format");

program.parse();
const devMode = program.args.length > 0 && !!program.args[0];

const packageFile = "/home/plugins/package.json";
const package = utils.readJson(packageFile);
const tools = utils.readJson("/home/plugins/config/tools.json");

if(devMode === true) {
  console.log(`show-dev-shortcuts: Rewriting '${packageFile}' to include all tools`);
  tools.forEach(tool => {
    if(tool.package === "main-tool") { return; } // Skip main tool

    package.activationEvents.push(`onCommand:${tool.commandName}`);
    package.contributes.commands.push({
      command: tool.commandName,
      title: `${tool.name} (DEBUG)`,
    });
  });
} else {
  console.log(`show-dev-shortcuts: Argument was '${devMode}', using default configuration.`);
}

utils.writeLines(packageFile, jsonFormat(package));
