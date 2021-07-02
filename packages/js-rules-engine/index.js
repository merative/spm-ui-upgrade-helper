var esprima = require('esprima');
var estraverse = require('estraverse');
const fileio = require('@folkforms/file-io');
const utils = require("../shared-utils/sharedUtils");
const { applyRulesToJS } = require("./src/applyRulesToJS");

/**
 * Main method. Will be called via http://localhost:4002/execute
 */
const execute = () => {
  // estraverse.traverse(x2, {
  //   enter: function (node, parent) {
  //     console.log("traverse-enter");
  //     if (node.type == 'FunctionExpression' || node.type == 'FunctionDeclaration') {
  //       return estraverse.VisitorOption.Skip;
  //     }
  //   },
  //   leave: function (node, parent) {
  //     console.log("traverse-leave");
  //     if (node.type == 'VariableDeclarator') {
  //       console.log(node.id.name);
  //     }
  //   }
  // });

  try {
    // Initial setup
    const config = utils.loadConfig();
    utils.removeOutputFolder(config);
    utils.createGitRepo(config);
    const targetFiles = utils.addTargetFiles(config, "js");
    utils.commitFiles(config.outputFolder, "feat(*): initial commit");

    // Apply the rules to the files
    let count = 1;
    const modified = {};
    targetFiles.forEach(filename => {
      console.log(`Processing file ${count++} of ${targetFiles.length}`);
      console.log(`filename = ${filename}`);
      const contents = fileio.readLines(filename);
      // modified[filename] = applyRulesToJS(contents, rules, filename);

      // FIXME New AST stuff
      let x1 = esprima.tokenize(contents.join("\n"));
      x1 = x1.filter(item => item.type === "String");
      console.log(`x1 = ${JSON.stringify(x1)}`);

      // const x2 = esprima.parseScript(contents.join("\n"));
      // console.log(`x2 = ${JSON.stringify(x2)}`);
    });
    utils.writeFilesToDisk(modified, config);
    // utils.commitFiles(config.outputFolder, "???");
    // utils.writeFilesToDisk(???, config);

  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  console.log("All done!");
}

module.exports = { execute };