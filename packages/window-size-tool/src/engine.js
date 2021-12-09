const chalk = require("chalk");
const xp = require("xpath");
const http = require('http');
let flag = true;
let responseAsJson={};
let whitelisted='';
let codeTable='';
let req;

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
const { connect } = require("http2");

// console.log('xp',xp);

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
    if (pass == true){
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
async function applyRule(
  document,
  filename,
  rules,
  sizes,
  pagedictionary,
  usePixelWidths,
  verbose = true
) {
  let serverAccessBeans = [];
  let connectionsAreAllowListed = true;
  const pageNode = document.documentElement;


  const severBeanXP= xp.select(
    `//SERVER_INTERFACE`,
    pageNode
  );
 

  severBeanXP.forEach((bean) => {
    serverAccessBeans.push({
      class: bean.getAttribute("CLASS"),
      name:bean.getAttribute("NAME"),
      operation:bean.getAttribute("OPERATION"),
    });
  });

  const clusterFieldConnectionsXP= xp.select(
    `//CLUSTER/FIELD/CONNECT/*`,
    pageNode
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
              result:false,
            });
       }
   }); 
  });

  const connectionPromises = [];
  for(let i=0; i < connections.length; i++){
    const connection = connections[i];
    //const result = await doRequest(connections[i], filename);
    const result = await doRequest(connection, filename);
    connectionPromises.push({result: result, property:  connection.property});
  }

  let connectionResults = await Promise.all(connectionPromises);
  console.log(connectionResults);
  for(let j=0; j < connectionResults.length; j++) {
    if(connectionResults[j].result == false) {
      connectionsAreAllowListed = false; 
      break;
    }
  }
  console.log("FLAG: " + connectionsAreAllowListed);
  // connections are allow listed and number of connections is bigger than 0
  const connectionsNotEmotyAndAllowed = connections.length > 0 && connectionsAreAllowListed == true;


  let hasChanges = false;


  if(connectionsNotEmotyAndAllowed){
    console.log("Appliying rule for: " + filename);
    rules.forEach((rule, index) => {
    if (!hasChanges) {
      if (verbose) {
        console.debug(`rule: ${chalk.yellow(index + 1)}`);
      }
      console.log("apply rules to uim ")
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
 async function applyRule_1(
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

  console.log("IM NEING CALLED");
  const newArray=[];
  const pageNode = document.documentElement;
  newArray.push(pageNode);
  console.log("PageNode",newArray.length);
  let serverAccessBeans = [];
  
  const severBeanXPClass= xp.select(
    `//SERVER_INTERFACE`,
    pageNode
  );

  severBeanXPClass.forEach((bean) => {
    serverAccessBeans.push({
      class: bean.getAttribute("CLASS"),
      name:bean.getAttribute("NAME"),
      operation:bean.getAttribute("OPERATION"),
    });
  });
 
  const clusterFieldConnections= xp.select(
    `//CLUSTER/FIELD/CONNECT/*`,
    pageNode
  ); 

  let connections=[];

  clusterFieldConnections.forEach((connection) => {
    const name=connection.getAttribute("NAME");
    const property =connection.getAttribute("PROPERTY");  
      serverAccessBeans.forEach((bean) => {
        if(name==bean.name){    
             connections.push({
              property: property,
              name:bean.class,
              operation:bean.operation,
              result:false,
            });
       }
   }); 
  });

 for(let i=0; i < connections.length; i++){
   console.log("connection -------",  connections
   );
   const result = await doRequest(connections[i], filename);
   console.log("ResultYY", result);
   connections[i].result== result;
  //  if (result == false) { 
  //   console.log("we want to finish that task",flag);
  //   flag=false;
  //   console.log("we want to finish that task2",flag);
  //   break;
//  }
    console.log("end of for loop",flag);
 }

   for (let j=0; j< connections.length;j++){
     if(connections[j].result == false) {
       console.log("Check if we have connection", connections[j].result);
       flag = false; 
       break;
     }
   }

 console.log('I AM outside',flag);
  if (verbose) {
    console.debug(`filename: ${chalk.cyan(filename)}`);
  }

  let hasChanges = false;

  if(flag==true){
    rules.forEach((rule, index) => {
    if (!hasChanges) {
      if (verbose) {
        console.debug(`rule: ${chalk.yellow(index + 1)}`);
      }
      console.log("apply rules to uim  ")
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
  }
console.log("haschanges in the end", hasChanges);
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
  }  else if (!serializer) {
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
/**
 * Send http request
 * @param {object} connection connection object 
 */
 const doRequest_1 =(connection, filename) => new Promise(function(resolve,reject){
   let newFlag=true;
      req = http.get( `http://spm-ui-upgrade-helper_nodefront:4005/full/${connection.property}/${connection.operation}/${connection.name}`, res => {
          console.log("File name", filename);
          console.log("Property:  ", connection.property);
          console.log ("Class: ", connection.name);
          console.log ("Operation: ", connection.operation);
          console.log ("----------------------------");
          res.on('data', d => {
              responseAsJson = JSON.parse(d.toString());  
              whitelisted = responseAsJson.whitelisted;
              codeTable = responseAsJson.codetable;  
              console.log(responseAsJson); 
              if (whitelisted ==="false" && codeTable === "false"){
                console.log("Change the flag");
                newFlag=false;                       
              }
              resolve(newFlag);
            })
          }) 
        req.on('error', error => {
          console.error('Error',error);
          reject(newFlag);
        }) 
        req.end();
  })



module.exports = {
  checkWidth,
  checkPageWidth,
  checkLinkWidth,
  checkRule,
  updateWidthOption,
  applyRule,
  applyRules,
};