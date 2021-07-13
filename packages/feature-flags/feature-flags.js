/**
 * If run with "true" as an argument, will modify ../plugins/package.json to include shortcuts for
 * all known tools, regardless of whether they are enabled or not.
 *
 * Note that ../plugins/package.json is a copy of ../vs-upgrade-helper-plugins/package.json.
 */
const { program } = require("commander");
const fileio = require("@folkforms/file-io");
const jsonFormat = require("json-format");

program.parse();
const devMode = program.args.length > 0 && !!program.args[0];
console.log(`devMode = ${devMode}`);

const packageFile = "../plugins/package.json";
const package = fileio.readJson(packageFile);
const tools = fileio.readJson("./tools.json");

if(devMode === true) {
  console.log(`feature-flags: Rewriting '${packageFile}' to include all tools`);
  tools.forEach(tool => {
    if(tool.package === "main") { return; } // Skip main tool

    package.activationEvents.push(`onCommand:${tool.commandName}`);
    package.contributes.commands.push({
      command: tool.commandName,
      title: tool.name,
    });
  });
} else {
  console.log("feature-flags: No args, using default configuration.");
}

fileio.writeLines(packageFile, jsonFormat(package));
