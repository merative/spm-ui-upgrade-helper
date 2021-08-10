var esprima = require('esprima');
const utils = require("../shared-utils/sharedUtils");

/**
 * Main method. Will be called via http://localhost:40xx/execute
 */
const execute = overrides => {
  const config = utils.loadConfig(overrides);
  utils.init(config);

  // Initial setup
  let targetFiles = config.internal.files;
  targetFiles = utils.keepFiles(targetFiles, "js");

  try {
    // const modified = {};
    targetFiles.forEach(filename => {
      const contents = utils.readLines(filename);
      // Example identifiers
      const identifiers = [
        "getElementById",
        "getElementByClass",
        "byId",
        "byClass",
        "addClass",
        "attr",
        "query",
        "create",
        "className",
        "innerHTML",
        "className",
        "getAttribute",
        "setAttribute",
        "style",
        "write",
        "createElement",
        "height", // Style as attribute
        "getElementsByTagName", // Might manipulate them later
        // "element["className"]
        // "element[classNameFromVar]
        // "element.className.indexOf(someVar)
        // "element.style.visibility = "visible"
        // "element.style.backgroundColor = "#F4FAB4"
        // "domConstruct.place(domConstruct.toDom(rawHtml), location)
        // "document.body.style
        // var re = new RegExp('^sortTableBdy');
      ];

      // Find identifiers
      let foundIdentifiers = esprima.tokenize(contents.join("\n"));
      foundIdentifiers = foundIdentifiers.filter(item =>
        item.type === "Identifier" &&
        identifiers.indexOf(item.value) !== -1
      );
      if(foundIdentifiers.length > 0) {
        console.info(`filename = ${filename}`);
        console.info(`foundIdentifiers = ${JSON.stringify(foundIdentifiers)}`);
      }
    });

    // Save changes
    // ...

  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  console.info("js-rules-tool finished");
}

module.exports = { execute };
