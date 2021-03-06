const { evaluateInequality } = require("./util");

describe("evaluateInequality", () => {
  test("should return 'undefined' when no args are passed", () => {
    const actual = () => evaluateInequality();

    expect(actual).toThrow();
  });

  test("should return 'undefined' when there is no operator", () => {
    const firstOperand = 1;
    const secondOperand = 2;

    const actual = () => evaluateInequality(firstOperand, secondOperand);

    expect(actual).toThrow();
  });

  test("should return 'undefined' when an invalid operator is passed", () => {
    const firstOperand = 1;
    const secondOperand = 2;
    const operator = "-";

    const actual = () =>
      evaluateInequality(firstOperand, secondOperand, operator);

    expect(actual).toThrow();
  });

  test("should return 'true' when 1 < 2 args are passed", () => {
    const expected = true;

    const firstOperand = 1;
    const secondOperand = 2;
    const operator = "<";

    const actual = evaluateInequality(firstOperand, secondOperand, operator);

    expect(actual).toEqual(expected);
  });

  test("should return 'true' when 1 <= 2 args are passed", () => {
    const expected = true;

    const firstOperand = 1;
    const secondOperand = 2;
    const operator = "<=";

    const actual = evaluateInequality(firstOperand, secondOperand, operator);

    expect(actual).toEqual(expected);
  });

  test("should return 'false' when 1 > 2 args are passed", () => {
    const expected = false;

    const firstOperand = 1;
    const secondOperand = 2;
    const operator = ">";

    const actual = evaluateInequality(firstOperand, secondOperand, operator);

    expect(actual).toEqual(expected);
  });

  test("should return 'false' when 1 >= 2 args are passed", () => {
    const expected = false;

    const firstOperand = 1;
    const secondOperand = 2;
    const operator = ">=";

    const actual = evaluateInequality(firstOperand, secondOperand, operator);

    expect(actual).toEqual(expected);
  });

  test("should return 'true' when 1 <= 1 args are passed", () => {
    const expected = true;

    const firstOperand = 1;
    const secondOperand = 1;
    const operator = "<=";

    const actual = evaluateInequality(firstOperand, secondOperand, operator);

    expect(actual).toEqual(expected);
  });

  test("should return 'true' when 1 >= 1 args are passed", () => {
    const expected = true;

    const firstOperand = 1;
    const secondOperand = 1;
    const operator = ">=";

    const actual = evaluateInequality(firstOperand, secondOperand, operator);

    expect(actual).toEqual(expected);
  });
});
