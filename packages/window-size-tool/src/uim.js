const xp = require("xpath");

function getWindowOptions(node) {
  let windowOptions = {};

  const optionsString = node.getAttribute("WINDOW_OPTIONS");

  if (optionsString) {
    windowOptions = optionsString
      .replace(/ /g, "")
      .split(",")
      .reduce((acc, option) => {
        const [key, value] = option.split("=");

        acc[key] = value;

        return acc;
      }, windowOptions);
  }

  return windowOptions;
}

/**
 * Gets the WINDOWS_OPTIONS attribute of the PAGE element.
 *
 * @param {object} document UIM document where the PAGE element exists.
 * @returns JS object representing the WINDOWS_OPTIONS string.
 */
function getPageWindowOptions(document) {
  if (!document || !document.documentElement) {
    return;
  }

  return getWindowOptions(document.documentElement);
}

function getLinkWindowOptions(document) {
  if (!document || !document.documentElement) {
    return;
  }

  let windowOptions = [];

  const links = xp.select("//LINK[@WINDOW_OPTIONS]", document);

  links.forEach((link) => {
    windowOptions.push({
      pageId: link.getAttribute("PAGE_ID"),
      options: getWindowOptions(link),
      link,
    });
  });

  return windowOptions;
}

function windowsOptionsObjectToString(windowOptions) {
  const optionsString = Object.entries(windowOptions)
    .map(([key, value]) => `${key}=${value}`)
    .join(",");

  return optionsString;
}

/**
 * Updates the WINDOW_OPTIONS attribute of a specified UIM file.
 *
 * @param {object} file UIM file where the PAGE element exists.
 * @param {object} windowOptions JS object representing the WINDOWS_OPTIONS string.
 * @returns UIM document with new WINDOW_OPTIONS attribute set.
 */
function setPageWindowOptions(document, windowOptions) {
  if (
    !document ||
    !document.documentElement ||
    !document.documentElement.setAttribute ||
    !windowOptions ||
    typeof windowOptions !== "object"
  ) {
    return;
  }

  const optionsString = windowsOptionsObjectToString(windowOptions);

  document.documentElement.setAttribute("WINDOW_OPTIONS", optionsString);

  return document;
}

function setLinkWindowOptions(link, windowOptions) {
  if (
    !link ||
    !link.setAttribute ||
    !windowOptions ||
    typeof windowOptions !== "object"
  ) {
    return;
  }

  const optionsString = windowsOptionsObjectToString(windowOptions);

  link.setAttribute("WINDOW_OPTIONS", optionsString);

  return link;
}

module.exports = {
  getWindowOptions,
  getPageWindowOptions,
  getLinkWindowOptions,
  setPageWindowOptions,
  setLinkWindowOptions,
};
