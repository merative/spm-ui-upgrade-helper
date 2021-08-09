const chalk = require("chalk");
const xp = require("xpath");

const { evaluateInequality } = require("./util");
const {
  getPageWindowOptions,
  getLinkWindowOptions,
  setPageWindowOptions,
  setLinkWindowOptions,
} = require("./uim");

function checkWidth(width, rule, verbose = true) {
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
 * Checks if a UIM file meets the width criteria defined by a rules object.
 *
 * @param {object} file UIM file to compare to rules width criteria.
 * @param {object} rule Rules object.
 * @returns Whether a UIM file meets the width criteria or not.
 */
function checkPageWidth(document, rule, verbose = true) {
  if (
    !document ||
    !document.documentElement ||
    !document.documentElement.getAttribute ||
    !rule ||
    typeof rule !== "object"
  ) {
    return;
  }

  const { width } = getPageWindowOptions(document);

  return checkWidth(width, rule.width, verbose);
}

function checkLinkWidth(document, rule, verbose = true) {
  if (
    !document ||
    !document.documentElement ||
    !document.documentElement.getAttribute ||
    !rule ||
    typeof rule !== "object"
  ) {
    return;
  }

  const links = getLinkWindowOptions(document).filter((link) => {
    return checkWidth(link.options.width, rule.width, verbose);
  });

  return links;
}

/**
 * Compares UIM file to rules criteria.
 *
 * @param {object} file UIM file to compare to rules criteria.
 * @param {object} rule Rules object.
 * @returns Whether the UIM file meets the rules criteria or not.
 */
function checkRule(document, rule, verbose = true) {
  let pass = false;

  if (!document || !rule || typeof rule !== "object") {
    return pass;
  }

  rule.terms.forEach((xPath) => {
    if (!pass) {
      const result = xp.select(xPath, document);

      pass = pass || result;

      if (verbose) {
        console.debug(
          ` term:  ${
            result ? chalk.green(`${result} `) : chalk.red(result)
          } <- [${chalk.magenta(xPath)}]`
        );
      }
    }
  });

  return pass;
}

/**
 * Applies xPath rules to UIM files from the inputFolders.
 *
 * @param {array} inputFiles UIM files from input folder.
 * @param {array} rules Rules to apply to the UIM files.
 * @param {object} sizes Mapping breakpoints to be applied to UIMs if rules criteria a met.
 * @returns Array of UIM files transformed by rules.
 */
function applyRule(document, name, rules, sizes, references, verbose = true) {
  if (
    !document ||
    !name ||
    !rules ||
    !Array.isArray(rules) ||
    !sizes ||
    typeof sizes !== "object"
  ) {
    return;
  }

  if (verbose) {
    console.debug(`filename: ${chalk.cyan(name)}`);
  }
  let hasChanges = false;

  rules.forEach((rule, index) => {
    if (!hasChanges) {
      if (verbose) {
        console.debug(`rule: ${chalk.yellow(index + 1)}`);
      }

      if (checkPageWidth(document, rule, verbose)) {
        const pass = checkRule(document, rule, verbose);

        if (pass) {
          hasChanges = true;
          const windowOptions = getPageWindowOptions(document);

          // This is where we can flip between pixels and size attribute
          const usePixelWidths = true;
          if (usePixelWidths) {
            windowOptions.width = sizes[rule.target];
          } else {
            delete windowOptions.width;
            windowOptions.size = rule.target;
          }

          setPageWindowOptions(document, windowOptions);
        }
      }

      const matches = checkLinkWidth(document, rule, verbose);

      matches.forEach(({ pageId, options, link }) => {
        let pass = false;

        const reference = references[pageId];

        if (reference) {
          pass = checkRule(reference.document, rule, verbose);

          hasChanges = hasChanges || pass;

          // This is where we can flip between pixels and size attribute
          const usePixelWidths = true;
          if (usePixelWidths) {
            options.width = sizes[rule.target];
          } else {
            delete options.width;
            options.size = rule.target;
          }

          if (pass) {
            setLinkWindowOptions(link, options);
          }
        }
      });
    }
  });

  return { document, hasChanges };
}

/**
 *
 * @param {array} files .
 * @param {array} rules .
 * @param {object} sizes .
 * @param {object} io .
 * @param {object} parser .
 * @param {object} serializer .
 * @returns .
 */
function applyRules(files, rules, sizes, io, parser, serializer) {
  const results = [];

  const references = {};

  const uims = files.map((file) => {
    const contents = io.readLines(file).join("\n");
    const document = parser.parseFromString(contents);

    const pageId = document.documentElement.getAttribute("PAGE_ID");

    references[pageId] = {
      file,
      document,
    };

    return {
      pageId,
      file,
      document,
    };
  });

  uims.forEach(({ document: prevDocument, file }) => {
    const { document: nextDocument, hasChanges } = applyRule(
      prevDocument,
      file,
      rules,
      sizes,
      references
    );

    // // Only mark the files as 'for writing' if the contents changed
    if (hasChanges) {
      console.log("nextDocument", nextDocument);
      results[file] = serializer.serializeToString(nextDocument);
    }
  });

  return results;
}

module.exports = {
  checkPageWidth,
  checkRule,
  applyRule,
  applyRules,
};
