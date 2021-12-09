const chalk = require("chalk");
const xp = require("xpath");
const path = require('path');

const { evaluateInequality } = require("./util");
const {
  getPageOptions,
  getLinkOptions,
  setPageOptions,
  setLinkOptions,
} = require("./uim");
const {
  doRequest,
} = require("./httpUtils");


let parserToUse = null;


let ioToUse = null;

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
  if (rule.anyTerms.length > 0) {
    rule.anyTerms.forEach((term) => {
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
    });
  } else if (rule.allTerms.length > 0) {
    pass = true;
  }
  if (pass == true) {
    rule.allTerms.forEach((term) => {
      if (pass) {
        const result2 = xp.select(term, node);
        pass = result2;
        if (verbose) {
          console.debug(
            ` term:  ${
              result2 ? chalk.green(`${result2} `) : chalk.red(result2)
            } <- [${chalk.magenta(term)}]`
          );
        }
      });
    }
   /* if (pass == true){
      rule.containsAllowedDomainsOnly.forEach((term) => {
      if (pass) {
        const result3 = xp.select(term, node);
        pass = result3;
        if (verbose) {
          console.debug(
            ` term:  ${
              result3 ? chalk.green(`${result3} `) : chalk.red(result3)
            } <- [${chalk.magenta(term)}]`
          );
        }
      }
    });
   } */
  });
      }
    });
  }
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
function updateWidthOption(windowOptions, sizes, target, usePixelWidths) {
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
 * Checks the domain definitions of UIM XML document are valid with respect to
 * allowing it to be resized down.
 *
 * @param {Element} rootUIMNode The root node of the UIM XML document.
 * @param {string} filename Filename of UIM XML document.
 */
async function checkUIMDomainsAreValidToResizeDown(rootUIMNode, filename) {
  let serverAccessBeans = [];
  let connectionsAreAllowListed = true;
  const fileNameAndExtenionWithoutPath = path.basename(filename);
  
  const severBeanXP= xp.select(
    `//SERVER_INTERFACE`,
    rootUIMNode
  );

  const includeVimsXP = xp.select(
    `//INCLUDE`,
    rootUIMNode
  );

  const vimsToBeProcessed = [];
  includeVimsXP.forEach((include) => {
    // TODO: How about if the VIM is not in the same directory??
    vimsToBeProcessed.push(path.dirname(filename) + "/" + include.getAttribute("FILE_NAME"));
  });
 

  severBeanXP.forEach((bean) => {
    serverAccessBeans.push({
      class: bean.getAttribute("CLASS"),
      name:bean.getAttribute("NAME"),
      operation:bean.getAttribute("OPERATION"),
    });
  });

  const clusterFieldConnectionsXP= xp.select(
    `//CLUSTER/FIELD/CONNECT/*`,
    rootUIMNode
  ); 

  let connections=[];

  clusterFieldConnectionsXP.forEach((connection) => {
    const name= connection.getAttribute("NAME");
    const property = connection.getAttribute("PROPERTY");  
      serverAccessBeans.forEach((bean) => {
        if(name==bean.name){    
             connections.push({
              property: property,
              name:bean.class,
              operation:bean.operation,
            });
       }
   }); 
  });

   // Processing VIMS, scope for refactoring here
   for (let i = 0; i < vimsToBeProcessed.length;i++) {
    const rootNode = getRootNodeFromUIM(vimsToBeProcessed[i], parserToUse, ioToUse);
    const severBeanXPForVim= xp.select(
      `//SERVER_INTERFACE`,
      rootNode
    );
    severBeanXPForVim.forEach((bean) => {
      const beanName = bean.getAttribute("NAME");
      if (!serverAccessBeans.find(({name}) => name === beanName)) {
        serverAccessBeans.push({
          class: bean.getAttribute("CLASS"),
          name:bean.getAttribute("NAME"),
          operation:bean.getAttribute("OPERATION"),
        });
      }      
    });
    const clusterFieldConnectionsXPForVims = xp.select(
      `//CLUSTER/FIELD/CONNECT/*`,
      rootNode
    );
    clusterFieldConnectionsXPForVims.forEach((connection) => {
      const connName= connection.getAttribute("NAME");
      const connProperty = connection.getAttribute("PROPERTY");
        serverAccessBeans.forEach((bean) => {
          if(connName==bean.name){
            // TODO: Need to check that names don't match either??
            if (!connections.find(({property}) => property === connProperty)) {    
               connections.push({
                property: connProperty,
                name:bean.class,
                operation:bean.operation,
              });
            }
         }
     });
    });
  }

  const connectionPromises = [];
  for(let i=0; i < connections.length; i++){
    const connection = connections[i];
    const result = await doRequest(connection, fileNameAndExtenionWithoutPath);
    connectionPromises.push({result: result, property: connection.property, filename: fileNameAndExtenionWithoutPath});
  }

  let connectionResults = await Promise.all(connectionPromises);
  for(let j=0; j < connectionResults.length; j++) {
    if(connectionResults[j].result == false) {
      connectionsAreAllowListed = false; 
      break;
    }
  }

  // connections are allow listed and number of connections is bigger than 0
  const connectionsNotEmotyAndAllowed = connections.length > 0 && connectionsAreAllowListed == true;
  return connectionsNotEmotyAndAllowed; 
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


function getDocumentFromUIM(file, parser, io) {
  const contents = io.readLines(file).join("\n");
  const document = parser.parseFromString(contents);
  return document;
}

function getRootNodeFromUIM(file, parser, io) {
  return getDocumentFromUIM(file, parser, io).documentElement;
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
  verbose = true,
  checkAllowedDomainsForResizing = true,
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

  parserToUse = parser;
  ioToUse = io;

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

  uims.forEach(async({ document, file }) => {
    const fileExtension = path.extname(file);
    // only do domain check for UIM files (Need to update) and if this flag is set. If tthe flag not set the check always passes
    const domainCheckPassed = checkAllowedDomainsForResizing && fileExtension === ".uim" ? await checkUIMDomainsAreValidToResizeDown(document.documentElement, file) : true;
    const hasChanges = domainCheckPassed && applyRule(
      document,
      file,
      rules,
      sizes,
      term,
      pagedictionary,
      usePixelWidths,
      verbose
    );

    // Only mark the files as 'for writing' if the contents changed
    if (hasChanges) {  
      results[file] = serializer.serializeToString(document);
    }
    console.log("haschanged", hasChanges);  
   });
   
  if (checkAllowedDomainsForResizing == true){
    rule.containsAllowedDomainsOnly.forEach((term) => {
    if (checkAllowedDomainsForResizing) {
      const result = xp.select(term, node);
      checkAllowedDomainsForResizing = result;
      if (verbose) {
        console.debug(
          ` term:  ${
            result ? chalk.green(`${result} `) : chalk.red(result)
          } <- [${chalk.magenta(term)}]`
        );
      }
    }
  });
}
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
  checkUIMDomainsAreValidToResizeDown,
  getRootNodeFromUIM
};