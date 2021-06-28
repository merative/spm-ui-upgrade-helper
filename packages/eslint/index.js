// module.exports = {
//     rules: {
//         "no-template-literals": {
//             create: function(context) {
//                 return {
//                     TemplateLiteral(node) {
//                         context.report(node, 'Do not use template literals');
//                     }
//                 };
//             }
//         }
//     }
// };

/**
 * @fileoverview Rule to flag use of alert, confirm, prompt
 * @author Nicholas C. Zakas
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------


function getPropertyName(node) {
    let prop;

    switch (node && node.type) {
        case "ChainExpression":
            return getStaticPropertyName(node.expression);

        case "Property":
        case "MethodDefinition":
            prop = node.key;
            break;

        case "MemberExpression":
            prop = node.property;
            break;

            // no default
    }

    if (prop) {
        if (prop.type === "Identifier" && !node.computed) {
            return prop.name;
        }

        return getStaticStringValue(prop);
    }

    return null;
}
/**
 * Finds the variable by a given name in a given scope and its upper scopes.
 * @param {eslint-scope.Scope} initScope A scope to start find.
 * @param {string} name A variable name to find.
 * @returns {eslint-scope.Variable|null} A found variable or `null`.
 */
function getVariableByName(initScope, name) {
  let scope = initScope;

  while (scope) {
    const variable = scope.set.get(name);

    if (variable) {
      return variable;
    }

    scope = scope.upper;
  }

  return null;
}


function skipChainExpression(node) {
    return node && node.type === "ChainExpression" ? node.expression : node;
}

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Checks if the given name is a prohibited identifier.
 * @param {string} name The name to check
 * @returns {boolean} Whether or not the name is prohibited.
 */
function isProhibitedIdentifier(name) {
  return /^(getElementsByTagName|getElementByID)$/u.test(name);
}

/**
 * Finds the eslint-scope reference in the given scope.
 * @param {Object} scope The scope to search.
 * @param {ASTNode} node The identifier node.
 * @returns {Reference|null} Returns the found reference or null if none were found.
 */
function findReference(scope, node) {
  const references = scope.references.filter(
    (reference) =>
      reference.identifier.range[0] === node.range[0] &&
      reference.identifier.range[1] === node.range[1]
  );

  if (references.length === 1) {
    return references[0];
  }
  return null;
}

/**
 * Checks if the given identifier node is shadowed in the given scope.
 * @param {Object} scope The current scope.
 * @param {string} node The identifier node to check
 * @returns {boolean} Whether or not the name is shadowed.
 */
function isShadowed(scope, node) {
  const reference = findReference(scope, node);

  return reference && reference.resolved && reference.resolved.defs.length > 0;
}

/**
 * Checks if the given identifier node is a ThisExpression in the global scope or the global window property.
 * @param {Object} scope The current scope.
 * @param {string} node The identifier node to check
 * @returns {boolean} Whether or not the node is a reference to the global object.
 */
function isGlobalThisReferenceOrGlobalWindow(scope, node) {
  if (scope.type === "global" && node.type === "ThisExpression") {
    return true;
  }
  if (
    node.type === "Identifier" &&
    (node.name === "window" ||
      (node.name === "globalThis" && getVariableByName(scope, "globalThis")))
  ) {
    return !isShadowed(scope, node);
  }

  return false;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  rules: {
    "no-template-literals": {
      meta: {
        type: "suggestion",

        docs: {
          description: "disallow the use of `alert`, `confirm`, and `prompt`",
          category: "Best Practices",
          recommended: false,
          url: "https://eslint.org/docs/rules/no-alert",
        },

        schema: [],

        messages: {
          unexpected: "Unexpected {{name}}.",
        },
      },

      create(context) {
        return {
          CallExpression(node) {
            const callee = skipChainExpression(node.callee),
              currentScope = context.getScope();

            // without window.
            if (callee.type === "Identifier") {
              const name = callee.name;

              if (
                !isShadowed(currentScope, callee) &&
                isProhibitedIdentifier(callee.name)
              ) {
                context.report({
                  node,
                  messageId: "unexpected",
                  data: { name },
                });
              }
            } else if (
              callee.type === "MemberExpression" &&
              isGlobalThisReferenceOrGlobalWindow(currentScope, callee.object)
            ) {
              const name = getPropertyName(callee);

              if (isProhibitedIdentifier(name)) {
                context.report({
                  node,
                  messageId: "unexpected",
                  data: { name },
                });
              }
            }
          },
        };
      },
    },
  },
};
