const xp = require("xpath");

const {
  evaluateInequality,
  getWindowOptions,
  setWindowOptions,
  checkWidth,
  checkRule,
  applyRules,
} = require("./engine");

jest.mock("xpath");

beforeEach(() => {
  xp.select.mockReset();
});

describe("evaluateInequality", () => {
  test("should return 'undefined' when no args are passed", () => {
    const expected = undefined;

    const actual = evaluateInequality();

    expect(actual).toEqual(expected);
  });

  test("should return 'undefined' when there is no operator", () => {
    const expected = undefined;

    const firstOperand = 1;
    const secondOperand = 2;

    const actual = evaluateInequality(firstOperand, secondOperand);

    expect(actual).toEqual(expected);
  });

  test("should return 'undefined' when an invalid operator is passed", () => {
    const expected = undefined;

    const firstOperand = 1;
    const secondOperand = 2;
    const operator = "-";

    const actual = evaluateInequality(firstOperand, secondOperand, operator);

    expect(actual).toEqual(expected);
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

describe("getWindowOptions", () => {
  test("should return 'undefined' when no args are passed", () => {
    const expected = undefined;

    const actual = getWindowOptions();

    expect(actual).toEqual(expected);
  });

  test("should return 'undefined' when malformed document is passed", () => {
    const expected = undefined;

    const document1 = {
      WINDOW_OPTIONS: "",
    };
    const actual1 = getWindowOptions(document1);

    expect(actual1).toEqual(expected);

    const document2 = {
      documentElement: {
        WINDOW_OPTIONS: "",
      },
    };
    const actual2 = getWindowOptions(document2);

    expect(actual2).toEqual(expected);
  });

  test("should return an empty object when WINDOW_OPTIONS is not set", () => {
    const expected = {};

    const document1 = {
      documentElement: {
        getAttribute: () => null,
      },
    };
    const actual1 = getWindowOptions(document1);

    expect(actual1).toEqual(expected);

    const document2 = {
      documentElement: {
        getAttribute: () => "",
      },
    };
    const actual2 = getWindowOptions(document2);

    expect(actual2).toEqual(expected);
  });

  test('should return \'{ "height": "400" }\' when a document with WINDOW_OPTIONS set to "height=400" is passed', () => {
    const expected = { height: "400" };

    const document = {
      documentElement: {
        getAttribute: () => "height=400",
      },
    };
    const actual = getWindowOptions(document);

    expect(actual).toEqual(expected);
  });

  test('should return \'{ "width": "400", "height": "400" }\' when a document with WINDOW_OPTIONS set to "width=400, height=400" is passed', () => {
    const expected = { width: "400", height: "400" };

    const document = {
      documentElement: {
        getAttribute: () => "width=400, height=400",
      },
    };
    const actual = getWindowOptions(document);

    expect(actual).toEqual(expected);
  });
});

describe("setWindowOptions", () => {
  test("should return 'undefined' when no args are passed", () => {
    const expected = undefined;

    const actual = setWindowOptions();

    expect(actual).toEqual(expected);
  });

  test("should return 'undefined' when only document arg is passed", () => {
    const expected = undefined;

    const document = {
      documentElement: {
        setAttribute: () => {},
      },
    };
    const actual = setWindowOptions(document);

    expect(actual).toEqual(expected);
  });

  test("should return a document with it's WINDOW_OPTIONS set to an empty string, when an empty windowOptions object is passed", () => {
    const expected = "";

    const mockSetAttribute = jest.fn();
    const document = {
      documentElement: {
        setAttribute: mockSetAttribute,
      },
    };
    setWindowOptions(document, {});

    const [property, actual] = mockSetAttribute.mock.calls[0];

    expect(actual).toEqual(expected);
  });

  test('should return a document with it\'s WINDOW_OPTIONS set to "height=400", when \'{ "height": "400" }\' is passed', () => {
    const expected = "height=400";

    const mockSetAttribute = jest.fn();
    const document = {
      documentElement: {
        setAttribute: mockSetAttribute,
      },
    };
    setWindowOptions(document, { height: 400 });

    const [property, actual] = mockSetAttribute.mock.calls[0];

    expect(actual).toEqual(expected);
  });

  test('should return a document with it\'s WINDOW_OPTIONS set to "width=400,height=400", when \'{ "width": "400", "height": "400" }\' is passed', () => {
    const expected = "width=400,height=400";

    const mockSetAttribute = jest.fn();
    const document = {
      documentElement: {
        setAttribute: mockSetAttribute,
      },
    };
    setWindowOptions(document, { width: 400, height: 400 });

    const [property, actual] = mockSetAttribute.mock.calls[0];

    expect(actual).toEqual(expected);
  });
});

describe("checkWidth", () => {
  test("should return 'undefined' when no args are passed", () => {
    const expected = undefined;

    const actual = checkWidth();

    expect(actual).toEqual(expected);
  });

  test("should return 'undefined' when document arg only is passed", () => {
    const expected = undefined;

    const document = {
      documentElement: {
        getAttribute: () => {},
      },
    };
    const actual = checkWidth(document);

    expect(actual).toEqual(expected);
  });

  test("should return 'false' when WINDOW_OPTIONS height only is set", () => {
    const expected = false;

    const document = {
      documentElement: {
        getAttribute: () => "height=400",
      },
    };
    const rule = {
      width: "> 200",
    };
    const actual = checkWidth(document, rule, false);

    expect(actual).toEqual(expected);
  });

  test("should return 'true' when WINDOW_OPTIONS width only is set", () => {
    const expected = true;

    const document = {
      documentElement: {
        getAttribute: () => "width=400",
      },
    };
    const rule = {
      width: "> 200",
    };
    const actual = checkWidth(document, rule, false);

    expect(actual).toEqual(expected);
  });

  test("should return 'true' when WINDOW_OPTIONS width and height is set", () => {
    const expected = true;

    const document = {
      documentElement: {
        getAttribute: () => "height=400, width=400",
      },
    };
    const rule = {
      width: "> 200",
    };
    const actual = checkWidth(document, rule, false);

    expect(actual).toEqual(expected);
  });

  test("should return 'false' when WINDOW_OPTIONS width is set '400' and rule is '< 200'", () => {
    const expected = false;

    const document = {
      documentElement: {
        getAttribute: () => "width=400",
      },
    };
    const rule = {
      width: "< 200",
    };
    const actual = checkWidth(document, rule, false);

    expect(actual).toEqual(expected);
  });

  test("should return 'true' when WINDOW_OPTIONS width is set '400' and rule is '<= 400'", () => {
    const expected = true;

    const document = {
      documentElement: {
        getAttribute: () => "width=400",
      },
    };
    const rule = {
      width: "<= 400",
    };
    const actual = checkWidth(document, rule, false);

    expect(actual).toEqual(expected);
  });

  test("should return 'true' when WINDOW_OPTIONS width is set '400' and rule is '>= 400'", () => {
    const expected = true;

    const document = {
      documentElement: {
        getAttribute: () => "width=400",
      },
    };
    const rule = {
      width: ">= 400",
    };
    const actual = checkWidth(document, rule, false);

    expect(actual).toEqual(expected);
  });

  test("should return 'false' when WINDOW_OPTIONS width is set '100' and rule is '>= 200 and <= 300'", () => {
    const expected = false;

    const document = {
      documentElement: {
        getAttribute: () => "width=100",
      },
    };
    const rule = {
      width: ">= 200 and <= 300",
    };
    const actual = checkWidth(document, rule, false);

    expect(actual).toEqual(expected);
  });

  test("should return 'false' when WINDOW_OPTIONS width is set '400' and rule is '>= 200 and <= 300'", () => {
    const expected = false;

    const document = {
      documentElement: {
        getAttribute: () => "width=400",
      },
    };
    const rule = {
      width: ">= 200 and <= 300",
    };
    const actual = checkWidth(document, rule, false);

    expect(actual).toEqual(expected);
  });

  test("should return 'true' when WINDOW_OPTIONS width is set '25000' and rule is '>= 200 and <= 300'", () => {
    const expected = true;

    const document = {
      documentElement: {
        getAttribute: () => "width=250",
      },
    };
    const rule = {
      width: ">= 200 and <= 300",
    };
    const actual = checkWidth(document, rule, false);

    expect(actual).toEqual(expected);
  });
});

describe("checkRule", () => {
  test("should return 'undefined' when no args are passed", () => {
    const expected = undefined;

    const actual = checkRule();

    expect(actual).toEqual(expected);
  });

  test("should return 'undefined' when document arg only is passed", () => {
    const expected = undefined;

    const document = {};
    const actual = checkRule(document);

    expect(actual).toEqual(expected);
  });

  test("should return 'false' when xpath rule passed matches document", () => {
    const expected = false;

    const document = {};
    const rule = {
      terms: ["rule.1"],
    };

    xp.select.mockImplementation(() => false);

    const actual = checkRule(document, rule, false);

    expect(actual).toEqual(expected);
  });

  test("should return 'true' when xpath rule passed matches document", () => {
    const expected = true;

    const document = {};
    const rule = {
      terms: ["rule.1"],
    };

    xp.select.mockImplementation(() => true);

    const actual = checkRule(document, rule, false);

    expect(actual).toEqual(expected);
  });

  test("should return 'true' when any of the xpath rules passed matches document", () => {
    const expected = true;

    const document = {};
    const rule = {
      terms: ["rule.1", "rule.2"],
    };

    xp.select.mockImplementation((rule) => rule === "rule.2");

    const actual = checkRule(document, rule, false);

    expect(actual).toEqual(expected);
  });
});

describe("applyRules", () => {
  const sizes = {
    xs: 0,
    sm: 500,
    md: 700,
    lg: 0,
    xlg: 0,
  };

  test("should return 'undefined' when no args are passed", () => {
    const expected = undefined;

    const actual = applyRules();

    expect(actual).toEqual(expected);
  });

  test("should return 'undefined' when only some args are passed", () => {
    const expected = undefined;

    const document = {
      documentElement: {
        getAttribute: () => {},
      },
    };
    const filename = "test.uim";
    const actual = applyRules(document, filename);

    expect(actual).toEqual(expected);
  });

  test("should update width to 'small' size when width '600' matches the rule '> 576 and <= 768' and terms pass", () => {
    const expected = `width=${sizes.sm}`;

    const mockSetAttribute = jest.fn();
    const document = {
      documentElement: {
        getAttribute: () => "width=600",
        setAttribute: mockSetAttribute,
      },
    };
    const filename = "test.uim";
    const rules = [
      {
        width: "> 576 and <= 768",
        terms: ["rule.1", "rule.2"],
        target: "sm",
      },
    ];

    xp.select.mockImplementation((rule) => true);

    applyRules(document, filename, rules, sizes, false);

    const [property, actual] = mockSetAttribute.mock.calls[0];

    expect(actual).toEqual(expected);
  });

  test("should update width to 'small' size when width '800' matches the rule '> 768' and terms pass", () => {
    const expected = `width=${sizes.md}`;

    const mockSetAttribute = jest.fn();
    const document = {
      documentElement: {
        getAttribute: () => "width=800",
        setAttribute: mockSetAttribute,
      },
    };
    const filename = "test.uim";
    const rules = [
      {
        width: "> 768",
        terms: ["rule.1", "rule.2"],
        target: "md",
      },
    ];

    xp.select.mockImplementation((rule) => true);

    applyRules(document, filename, rules, sizes, false);

    const [property, actual] = mockSetAttribute.mock.calls[0];

    expect(actual).toEqual(expected);
  });

  test("should not update width when width '800' matches the rule '> 768' but terms are not met", () => {
    const expected = 0;

    const mockSetAttribute = jest.fn();
    const document = {
      documentElement: {
        getAttribute: () => "width=800",
        setAttribute: mockSetAttribute,
      },
    };
    const filename = "test.uim";
    const rules = [
      {
        width: "> 768",
        terms: ["rule.1", "rule.2"],
        target: "md",
      },
    ];

    xp.select.mockImplementation((rule) => false);

    applyRules(document, filename, rules, sizes, false);

    const actual = mockSetAttribute.mock.calls.length;

    expect(actual).toEqual(expected);
  });
});