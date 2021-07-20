const fg = require("fast-glob");
const fs = require("fs");
const p = require("path");
const xmldom = require("xmldom");

const parser = new xmldom.DOMParser();
const serializer = new xmldom.XMLSerializer();

/**
 *
 *
 * @param {string} xmlString .
 * @returns .
 */
 function stringToXML(xmlString) {
  return parser.parseFromString(xmlString);
}

/**
 *
 *
 * @param {object} xmlDocument .
 * @returns .
 */
function xmlToString(xmlDocument) {
  return serializer.serializeToString(xmlDocument);
}

/**
 * Get the content of a JSON file and returns a JS object.
 *
 * @param {string} path Path to JSON file.
 * @returns JS object.
 */
function getJSONFile(path) {
  const string = fs.readFileSync(path);
  const json = JSON.parse(string);

  return json;
}

/**
 * Gets UIM rules from the file specified.
 *
 * @param {string} rulesFile Path to rules file.
 * @returns Array of rules objects.
 */
function getRules(rulesFile) {
  return getJSONFile(rulesFile);
}

/**
 * Gets all UIM/VIM files from the target directory.
 *
 * @param {string} inputFolder Target directory containing UIM files.
 * @returns Array of objects representing UIM files.
 */
function readUIMFiles(inputFolder) {
  const uimPattern = `${inputFolder}/**/*.uim`;
  const vimPattern = `${inputFolder}/**/*.vim`;
  const patterns = [uimPattern, vimPattern];

  const entries = fg.sync(patterns, { objectMode: true });

  let files = [];

  files = entries.map(({ name, path }) => {
    let file = {
      name,
      path,
      relative: p.relative(inputFolder, path),
      content: null,
      document: null,
    };

    try {
      const content = fs.readFileSync(path, "utf8");

      file.content = content;
      file.document = stringToXML(content);
    } catch (err) {
      console.error(err);
    }

    return file;
  });

  return files;
}

/**
 * Writes transformed UIM files to the output folder specified.
 *
 * @param {string} outputFolder Target directory where transformed UIM files should be written to.
 * @param {array} outputFiles Array of UIM files to write to the outputFolder.
 */
function writeUIMFiles(outputFolder, outputFiles) {
  outputFiles.forEach((file) => {
    const path = p.resolve(outputFolder, file.relative);
    const dirname = p.dirname(path);

    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }

    try {
      fs.writeFileSync(path, file.content);
    } catch (err) {
      console.error(err);
    }
  });
}

module.exports = {
  stringToXML,
  xmlToString,
  getRules,
  readUIMFiles,
  writeUIMFiles,
};
