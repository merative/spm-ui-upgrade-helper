/**
 * Checks if an icon filename has a new mapping.
 *
 * @param {string} filename Filename to check for a mapping.
 * @param {object} mappings Icon mappings object.
 * @returns Returns the new mapping if it exists, or null if no mapping is found.
 */
function getMapping(filename, mappings) {
  if (!mappings) {
    return null;
  }

  return mappings[filename] || null;
}

/**
 * Accepts the contents of a file as a string and checks whether it contains any filename mappings.
 *
 * @param {string} content File contents to check for references.
 * @param {object} mappings Icon mappings object.
 * @returns Returns the content string updated with the new references, or null if no references are found.
 */
function updateIconReferences(content, mappings) {
  let nextContent = content;
  let updated = false;

  if (!mappings) {
    return null;
  }

  Object.entries(mappings).forEach(([fromName, toName]) => {
    const shouldUpdate = content.indexOf(fromName) > -1;

    if (shouldUpdate) {
      nextContent = nextContent.split(fromName).join(toName);
    }

    updated = updated || shouldUpdate;
  });

  return updated ? nextContent : null;
}

module.exports = { getMapping, updateIconReferences };
