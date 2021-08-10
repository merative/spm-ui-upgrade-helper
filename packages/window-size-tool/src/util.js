// Accepted relational operators for width comparisons.
const OPERATORS = {
  LESS_THAN: "<",
  LESS_THAN_OR_EQUAL_TO: "<=",
  GREATER_THAN: ">",
  GREATER_THAN_OR_EQUAL_TO: ">=",
};

/**
 * Compares two values and returns a boolean value based on whether the comparison is true.
 *
 * @param {number} firstOperand Left hand side operand of the inequality.
 * @param {number} secondOperand Right hand side operand of the inequality.
 * @param {string} operator Relational operator used to compare operands.
 * @returns Whether the comparison is true or not.
 */
function evaluateInequality(firstOperand, secondOperand, operator) {
  switch (operator) {
    case OPERATORS.LESS_THAN: {
      return firstOperand < secondOperand;
    }
    case OPERATORS.LESS_THAN_OR_EQUAL_TO: {
      return firstOperand <= secondOperand;
    }
    case OPERATORS.GREATER_THAN: {
      return firstOperand > secondOperand;
    }
    case OPERATORS.GREATER_THAN_OR_EQUAL_TO: {
      return firstOperand >= secondOperand;
    }
    default: {
      throw "Operator is not valid";
    }
  }
}

module.exports = {
  evaluateInequality,
};
