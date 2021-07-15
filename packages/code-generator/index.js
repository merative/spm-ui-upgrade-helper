/**
 * Takes the data listed in `packages/config/tools.json` and generates a server.js file in each
 * tool's package folder. This is because the server.js is pure boilerplate, only the name and port
 * number change. Also generates `packages/vs-upgrade-helper-plugin/src/functions.ts` with the
 * details of the functions so that they will be included as IDE shortcuts.
 *
 * If run with "true" as an argument will run for all known tools, regardless of whether they are
 * enabled or not.
 */
const { program } = require("commander");
const fileio = require("@folkforms/file-io");
const nunjucks = require("nunjucks");

program.parse();
const devMode = program.args.length > 0 && program.args[0] == "true";
console.log(`code-generator: devMode = ${devMode}`);

// Generate server.js files
const tools = fileio.readJson("config/tools.json");

// Filter to use only enabled tools, or all tools in dev mode
let enabledTools = devMode ? tools : tools.filter(tool => tool.enabled);

// Generate server.js for all enabled tools, and a dummy version for all disabled tools
const serverJsTemplate = fileio.readLines("packages/code-generator/server.js.template").join("\n");
const dummyServerJsTemplate = fileio.readLines("packages/code-generator/dummy-server.js.template").join("\n");
tools.forEach(tool => {
  nunjucks.configure();
  const outputFile = `packages/${tool.package}/server.js`;
  const outputData = nunjucks.renderString(tool.enabled ? serverJsTemplate : dummyServerJsTemplate, tool);
  fileio.writeLines(outputFile, outputData);
  console.log(`code-generator: Generated ${outputFile}${devMode || tool.enabled ? "" : " (dummy version as tool is not enabled)" }`);
});

// Generate file containing function objects
const functionsTemplate = fileio.readLines("packages/code-generator/functions.ts.template").join("\n");
nunjucks.configure();
const functionsOutputData = nunjucks.renderString(functionsTemplate, { tools: enabledTools });
const functionsOutputFile = `packages/vs-upgrade-helper-plugin/src/functions.ts`;
fileio.writeLines(functionsOutputFile, functionsOutputData);
console.log(`code-generator: Generated functions.ts`);
