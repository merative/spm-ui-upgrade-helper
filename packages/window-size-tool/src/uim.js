const xp = require("xpath");

const PAGE_ID_ATTRIBUTE_NAME = "PAGE_ID";
const WINDOW_OPTIONS_ATTRIBUTE_NAME = "WINDOW_OPTIONS";

const KEY_VALUE_SEPARATOR = "=";
const PARAMETER_SEPARATOR = ",";

/**
 * Takes an object representing a WINDOWS_OPTIONS and transforms it to a string.
 *
 * @param {object} optionsObject Key/value WINDOWS_OPTIONS pairs.
 * @returns WINDOWS_OPTIONS string containing comma separated key/value pairs.
 */
function optionsObjectToString(optionsObject) {
  if (!optionsObject) {
    throw Error("You must supply a WINDOW_OPTIONS object");
  }

  const optionsString = Object.entries(optionsObject)
    .map(([key, value]) => `${key}${KEY_VALUE_SEPARATOR}${value}`)
    .join(PARAMETER_SEPARATOR);

  return optionsString;
}

/**
 * Takes a WINDOWS_OPTIONS string and transforms it to an object.
 *
 * @param {string} optionsString WINDOWS_OPTIONS string containing comma
 * separated key/value pairs.
 * @returns Key/value WINDOWS_OPTIONS pairs.
 */
function optionsStringToObject(optionsString) {
  if (!optionsString && optionsString !== "") {
    throw Error("You must supply a WINDOW_OPTIONS string");
  }

  let optionsObject = {};

  optionsObject = optionsString
    .replace(/ /g, "")
    .split(PARAMETER_SEPARATOR)
    .reduce((acc, option) => {
      const [key, value] = option.split(KEY_VALUE_SEPARATOR);

      acc[key] = value;

      return acc;
    }, optionsObject);

  return optionsObject;
}

/**
 * Accepts a DOM node and returns a WINDOW_OPTIONS string, if that attribute
 * exists on the node.
 *
 * @param {object} node DOM node who's WINDOW_OPTIONS attribute is set.
 * @returns WINDOWS_OPTIONS string, null if attribute does not exist.
 */
function getWindowOptions(node) {
  if (!node) {
    throw Error("You must supply a node");
  }

  let windowOptions = {};

  const optionsString = node.getAttribute(WINDOW_OPTIONS_ATTRIBUTE_NAME);

  if (optionsString === null) {
    return null;
  }

  windowOptions = optionsStringToObject(optionsString);

  return windowOptions;
}

/**
 * Gets the WINDOWS_OPTIONS attribute of a UIM PAGE element.
 *
 * @param {object} pageNode DOM node representing a UIM PAGE element.
 * @returns WINDOWS_OPTIONS string, null if attribute does not exist.
 */
function getPageOptions(pageNode) {
  return getWindowOptions(pageNode);
}

/**
 * Collects the WINDOWS_OPTIONS attributes of all UIM LINK elements that exist
 * on the PAGE element provided.
 *
 * @param {object} pageNode DOM node representing a UIM PAGE element.
 * @returns Array of objects representing LINK elements and their associated
 * WINDOWS_OPTIONS strings.
 */
function getLinkOptions(pageNode) {
  if (!pageNode) {
    throw Error("You must supply a PAGE node");
  }

  let linkOptions = [];

  const links = xp.select(
    `//LINK[@${WINDOW_OPTIONS_ATTRIBUTE_NAME} and @${PAGE_ID_ATTRIBUTE_NAME}]`,
    pageNode
  );

  if(links){
  links.forEach((link) => {
    linkOptions.push({
      pageId: link.getAttribute(PAGE_ID_ATTRIBUTE_NAME),
      options: getWindowOptions(link),
      link,
    });
  });
}

  return linkOptions;
}

/**
 * Updates the WINDOW_OPTIONS attribute of the specified DOM node.
 *
 * @param {object} node DOM node.
 * @param {object} optionsObject Key/value WINDOWS_OPTIONS pairs.
 */
function setWindowOptions(node, optionsObject) {
  const optionsString = optionsObjectToString(optionsObject);

  node.setAttribute(WINDOW_OPTIONS_ATTRIBUTE_NAME, optionsString);
}

/**
 * Updates the WINDOW_OPTIONS attribute of the specified PAGE element DOM node.
 *
 * @param {object} pageNode DOM node representing a UIM PAGE element.
 * @param {object} pageOptions Key/value WINDOWS_OPTIONS pairs.
 */
function setPageOptions(pageNode, pageOptions) {
  setWindowOptions(pageNode, pageOptions);
}

/**
 * Updates the WINDOW_OPTIONS attribute of the specified LINK element DOM node.
 *
 * @param {object} linkNode DOM node representing a UIM LINK element.
 * @param {object} linkOptions Key/value WINDOWS_OPTIONS pairs.
 */
function setLinkOptions(linkNode, linkOptions) {
  setWindowOptions(linkNode, linkOptions);
}

module.exports = {
  optionsObjectToString,
  optionsStringToObject,
  getWindowOptions,
  getPageOptions,
  getLinkOptions,
  setWindowOptions,
  setPageOptions,
  setLinkOptions,
};
