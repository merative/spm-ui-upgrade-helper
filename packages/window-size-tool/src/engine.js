const chalk = require("chalk");
const xp = require("xpath");

const { evaluateInequality } = require("./util");
const {
  getPageOptions,
  getLinkOptions,
  setPageOptions,
  setLinkOptions,
} = require("./uim");

/**
 * Compares a width value to a rule and returns whether the width passes the
 * rule or not.
 *
 * @param {number} width Width value.
 * @param {string} rule Rules expression.
 * @param {boolean} verbose Will log debug messages if true (true by default).
 * @returns Whether width passes the rule or not.
 */
function checkWidth(width, rule, verbose = true) {
  if (!width) {
    throw Error("You must supply a width");
  } else if (!rule) {
    throw Error("You must supply a rules string");
  }

  let pass = false;

  if (typeof width === "string") {
    width = parseInt(width);
  }

  if (width) {
    const limits = rule.split(" and ").map((limit) => limit.split(" "));

    pass = limits.reduce((result, limit) => {
      const [operator, ruleWidth] = limit;

      return result && evaluateInequality(width, ruleWidth, operator);
    }, true);
  }

  if (verbose) {
    console.debug(
      ` width: ${
        pass ? chalk.green(`${pass} `) : chalk.red(pass)
      } <- ${chalk.magenta(`[${width ? width : "none"}] · [${rule}]`)}`
    );
  }

  return pass;
}

/**
 * Compares a width value of a UIM PAGE element to a rule and returns whether
 * the width passes the rule or not.
 *
 * @param {object} pageNode DOM node representing a UIM PAGE element.
 * @param {string} rule Rules expression.
 * @param {boolean} verbose Will log debug messages if true (true by default).
 * @returns Whether UIM PAGE element width passes the rule or not.
 */
function checkPageWidth(pageNode, rule, verbose = true) {
  const pageOptions = getPageOptions(pageNode);

  if (!pageOptions || !pageOptions.width) {
    return false;
  }

  return checkWidth(pageOptions.width, rule, verbose);
}

/**
 * Takes a UIM PAGE element and checks it for LINK elements who's widths pass
 * the rule.
 *
 * @param {object} pageNode DOM node representing a UIM PAGE element.
 * @param {string} rule Rules expression.
 * @param {boolean} verbose Will log debug messages if true (true by default).
 * @returns Returns an array of LINK elements who's widths pass the rule.
 */
function checkLinkWidth(pageNode, rule, verbose = true) {
  const links = getLinkOptions(pageNode).filter((link) => {
    if (!link.options || !link.options.width) {
      return false;
    }

    return checkWidth(link.options.width, rule.width, verbose);
  });

  return links;
}

/**
 * Compares UIM file to rules criteria.
 *
 * @param {object} node DOM node to compare to rules criteria.
 * @param {object} rule Rules object.
 * @param {boolean} verbose Will log debug messages if true (true by default).
 * @returns Whether the DOM node meets the rules criteria or not.
 */
function checkRule(node, rule, verbose = true) {
  let pass = false;

  if (!node) {
    throw Error("You must supply a node");
  } else if (!rule) {
    throw Error("You must supply a rules object");
  }
  rule.terms.forEach((term) => {
    if (!pass) {
      const result = xp.select(term, node);

      pass = pass || result;

      if (verbose) {
        console.debug(
          ` term:  ${
            result ? chalk.green(`${result} `) : chalk.red(result)
          } <- [${chalk.magenta(term)}]`
        );
      }
    }
    if (pass == true){
        pass = false;
        rule.andTerms.forEach((term) => {
        if (!pass) {
          const result2 = xp.select(term, node);
          pass = pass || result2;
          if (verbose) {
            console.debug(
              ` term:  ${
                result2 ? chalk.green(`${result2} `) : chalk.red(result2)
              } <- [${chalk.magenta(term)}]`
            );
          }
        }
      });
    }
  });
  return pass;
}

/**
 * Updates the WINDOW_OPTIONS width value.
 *
 * @param {string} windowOptions WINDOW_OPTIONS string to update.
 * @param {object} sizes Mapping breakpoints to be applied to UIMs if rules
 * criteria a met.
 * @param {number} target Target width category from sizes.js file.
 * @param {boolean} usePixelWidths Determines whether width is set as a pixel value
 * or a size category.
 */
function updateWidthOption(
  windowOptions,
  sizes,
  target,
  usePixelWidths
) {
  if (!windowOptions) {
    throw Error("You must supply a WINDOW_OPTIONS string");
  } else if (!sizes) {
    throw Error("You must supply a sizes object");
  } else if (!target) {
    throw Error("You must supply a target size category");
  }

  if (usePixelWidths) {
    windowOptions.width = sizes[target];
  } else {
    delete windowOptions.width;
    windowOptions.size = target;
  }
}

/**
 * Applies xPath rules to a UIM XML document.
 *
 * @param {object} document Parsed UIM XML document.
 * @param {string} filename Filename of UIM XML document.
 * @param {array} rules Rules to apply to the UIM XML document.
 * @param {object} sizes Mapping breakpoints to be applied to UIMs if rules
 * criteria a met.
 * @param {object} pagedictionary A dictionary used to lookup UIM pages by id.
 * @param {boolean} usePixelWidths Determines whether width is set as a pixel value
 * or a size category.
 * @param {boolean} verbose Will log debug messages if true (true by default).
 * @returns Returns whether the document was updated by the rules or not.
 */
function applyRule(
  document,
  filename,
  rules,
  sizes,
  pagedictionary,
  usePixelWidths,
  verbose = true
) {
  if (!document) {
    throw Error("You must supply a UIM document");
  } else if (!filename && filename !== "") {
    throw Error("You must supply a filename");
  } else if (!rules) {
    throw Error("You must supply a rules array");
  } else if (!sizes) {
    throw Error("You must supply a size object");
  } else if (!pagedictionary) {
    throw Error("You must supply a PAGE dictionary map");
  }

  const pageNode = document.documentElement;

  if (verbose) {
    console.debug(`filename: ${chalk.cyan(filename)}`);
  }

  let hasChanges = false;

  rules.forEach((rule, index) => {
    if (!hasChanges) {
      if (verbose) {
        console.debug(`rule: ${chalk.yellow(index + 1)}`);
      }

      if (checkPageWidth(pageNode, rule.width, verbose)) {
        const pass = checkRule(pageNode, rule, verbose);

        if (pass) {
          hasChanges = true;
          const windowOptions = getPageOptions(pageNode);

          updateWidthOption(windowOptions, sizes, rule.target, usePixelWidths);

          setPageOptions(pageNode, windowOptions);
        }
      }

      const linkMatches = checkLinkWidth(pageNode, rule, verbose);

      linkMatches.forEach(({ pageId, options, link }) => {
        let pass = false;

        const pageReference = pagedictionary[pageId];

        if (pageReference) {
          pass = checkRule(
            pageReference.document.documentElement,
            rule,
            verbose
          );

          hasChanges = hasChanges || pass;

          updateWidthOption(options, sizes, rule.target, usePixelWidths);

          if (pass) {
            setLinkOptions(link, options);
          }
        }
      });
    }
  });

  return hasChanges;
}

/**
 * .
 *
 * @param {array} files A list of globbed UIM files.
 * @param {array} rules An array of xPath based rules.
 * @param {object} sizes Mapping breakpoints to be applied to UIMs if rules
 * criteria a met.
 * @param {object} io Util for reading contents of globbed files.
 * @param {object} parser Util for transforming globbed file content to an
 * object.
 * @param {object} serializer Util for transforming XML object back to a string.
 * @param {boolean} usePixelWidths Determines whether width is set as a pixel value
 * or a size category.
 * @param {boolean} verbose Will log debug messages if true (true by default).
 * @returns A list of files that have met the rules criteria and had their
 * width's updated.
 */
function applyRules(
  files,
  rules,
  sizes,
  io,
  parser,
  serializer,
  usePixelWidths,
  verbose = true
) {
  if (!files) {
    throw Error("You must supply a globbed files array");
  } else if (!rules) {
    throw Error("You must supply a rules array");
  } else if (!sizes) {
    throw Error("You must supply a size object");
  } else if (!io) {
    throw Error("You must supply an io object");
  } else if (!parser) {
    throw Error("You must supply an parser object");
  } else if (!serializer) {
    throw Error("You must supply an serializer object");
  }

  const results = [];

  const pagedictionary = {};

  const uims = files.map((file) => {
    const contents = io.readLines(file).join("\n");
    const document = parser.parseFromString(contents);

    const pageId = document.documentElement.getAttribute("PAGE_ID");

    pagedictionary[pageId] = {
      file,
      document,
    };

    return {
      pageId,
      file,
      document,
    };
  });

  uims.forEach(({ document, file }) => {
    const hasChanges = applyRule(
      document,
      file,
      rules,
      sizes,
      pagedictionary,
      usePixelWidths,
      verbose,
    );

    // Only mark the files as 'for writing' if the contents changed
    if (hasChanges) {
      results[file] = serializer.serializeToString(document);
    }
  });

  return results;
}

module.exports = {
  checkWidth,
  checkPageWidth,
  checkLinkWidth,
  checkRule,
  updateWidthOption,
  applyRule,
  applyRules,
};
