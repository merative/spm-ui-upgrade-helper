/**
 * Find occurrences of "${foo}" style variables which are not valid CSS and replace them with
 * placeholders while we do the processing. They will be restored afterwards.
 *
 * @param {string} contents file contents to check
 * @returns {[string, object]} file contents with invalid CSS replaced with placeholders, and a
 * key-value map of the placeholders used
 */
const removeInvalidCSS = contents => {
  let placeholders = {};
  let placeholderIndex = 0;
  let prefix = "PLACEHOLDER_";
  for (let i = 0; i < contents.length - 1; i++) {
    if (contents[i] == "$" && contents[i + 1] == "{") {
      let start = i;
      for (let j = i + 2; j < contents.length; j++) {
        if (contents[j] == "}") {
          let end = j + 1;

          // Split the string around the variable
          let before = contents.substring(0, start);
          let variable = contents.substring(start, end);
          let after = contents.substring(end);

          // Create a placeholder variable that will not break the CSS parser
          const placeholderName = "%" + prefix + placeholderIndex + "%";
          placeholders[placeholderName] = variable;
          placeholderIndex++;

          // Splice the placeholder string into the middle of contents
          contents = before + placeholderName + after;
          // Move 'i' to the end of the placeholder
          i = before.length + placeholderName.length - 1;
          break;
        }
      }
    }
  }
  return { contents, placeholders };
}

/**
 * Reinstate occurrences of "${foo}" style variables which were removed before parsing due to them
 * being invalid CSS.
 *
 * @param {string} contents file contents to check
 * @param {object} placeholders key-value map of the placeholders used to restore the variables
 * @returns {string} file contents with placeholders replaced with values
 */
const restoreInvalidCSS = (contents, placeholders) => {
  Object.keys(placeholders).forEach((key) => {
    contents = contents.replace(key, placeholders[key]);
  });
  return contents;
}

module.exports = {
  removeInvalidCSS,
  restoreInvalidCSS
};
