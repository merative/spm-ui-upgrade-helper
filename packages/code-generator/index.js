/**
 * Takes the data listed in `packages/config/ui-upgrade-helper-tools.json` and generates a server.js
 * file in each tool's package folder. This is because the server.js is pure boilerplate, only the
 * name and port number change. Also generates `packages/vs-upgrade-helper-plugin/src/functions.ts`
 * with the details of the functions so that they will be included as IDE shortcuts.
 */

const fileio = require("@folkforms/file-io");
const nunjucks = require("nunjucks");

// Generate server.js files
const tools = fileio.readJson("config/ui-upgrade-helper-tools.json");
const serverJsTemplate = fileio.readLines("packages/code-generator/server.js.template").join("\n");
tools.forEach(tool => {
  nunjucks.configure();
  const outputData = nunjucks.renderString(serverJsTemplate, tool);
  const outputFile = `packages/${tool.package}/server.js`;
  fileio.writeLines(outputFile, outputData);
});

// Generate file containing function objects
const functionsTemplate = fileio.readLines("packages/code-generator/functions.ts.template").join("\n");
nunjucks.configure();
const functionsOutputData = nunjucks.renderString(functionsTemplate, { tools });
const functionsOutputFile = `packages/vs-upgrade-helper-plugin/src/functions.ts`;
fileio.writeLines(functionsOutputFile, functionsOutputData);
