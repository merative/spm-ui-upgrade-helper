var esprima = require('esprima');
var estraverse = require('estraverse');
const utils = require("../shared-utils/sharedUtils");
const { applyRulesToJS } = require("./src/applyRulesToJS");

/**
 * Main method. Will be called via http://localhost:40xx/execute
 */
const execute = overrides => {
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

  const config = { ...utils.loadConfig(), ...overrides };
  utils.init(config);

  // Initial setup
  let targetFiles = config.files;
  targetFiles = utils.keepFiles(targetFiles, "js");

  try {
    // Apply the rules to the files
    const modified = {};
    targetFiles.forEach(filename => {
      const contents = utils.readLines(filename);
      // modified[filename] = applyRulesToJS(contents, rules, filename);

      const identifiers = [
        "addClass",
        "attr",
        "byId",
        "byClass",
        "query",
        "create",
        "className",
        "height", // ???
        "innerHTML",
        "className",
        // "element["className"]     // You can do this as well
        // "element[classNameFromVar]  // Or this
        // "element.className.indexOf(someVar)
        "style",
        // "element.style.visibility = "visible" // For example
        // "element.style.backgroundColor = "#F4FAB4" // For example
        "getAttribute",
        "setAttribute",
        // "domConstruct.place(domConstruct.toDom(rawHtml), location)
        "getElementsByTagName", // Might manipulate them later
        // "document.body.style
        "write",
        "getElementById",
        "createElement",
        // var re = new RegExp('^sortTableBdy'); // Is this a class? Yes, but hard to programatically tell.
        "getElementByClass",
      ];

      // FIXME New AST stuff
      let foundIdentifiers = esprima.tokenize(contents.join("\n"));
      foundIdentifiers = foundIdentifiers.filter(item =>
        item.type === "Identifier" &&
        identifiers.indexOf(item.value) !== -1
      );
      if(foundIdentifiers.length > 0) {
        console.info(`filename = ${filename}`);
        console.info(`foundIdentifiers = ${JSON.stringify(foundIdentifiers)}`);
      }

      // const x2 = esprima.parseScript(contents.join("\n"));
      // console.log(`x2 = ${JSON.stringify(x2)}`);
    });

    // Save changes
    // utils.writeFiles(modified);
    // utils.commitFiles(config.outputFolder, "???");
    // utils.writeFiles(???);

  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  console.info("js-rules-tool finished");
}

module.exports = { execute };
