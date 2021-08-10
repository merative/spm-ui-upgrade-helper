const xp = require("xpath");

const { checkPageWidth, checkRule, applyRule } = require("./engine");

jest.mock("xpath");

beforeEach(() => {
  xp.select.mockReset();
});

describe("checkPageWidth", () => {
  test("should return 'undefined' when no args are passed", () => {
    const expected = undefined;

    const actual = checkPageWidth();

    expect(actual).toEqual(expected);
  });

  test("should return 'undefined' when document arg only is passed", () => {
    const expected = undefined;

    const document = {
      documentElement: {
        getAttribute: () => {},
      },
    };
    const actual = checkPageWidth(document);

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
    const actual = checkPageWidth(document, rule, false);

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
    const actual = checkPageWidth(document, rule, false);

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
    const actual = checkPageWidth(document, rule, false);

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
    const actual = checkPageWidth(document, rule, false);

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
    const actual = checkPageWidth(document, rule, false);

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
    const actual = checkPageWidth(document, rule, false);

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
    const actual = checkPageWidth(document, rule, false);

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
    const actual = checkPageWidth(document, rule, false);

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
    const actual = checkPageWidth(document, rule, false);

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
      terms: ["criteria.1"],
    };

    xp.select.mockImplementation(() => false);

    const actual = checkRule(document, rule, false);

    expect(actual).toEqual(expected);
  });

  test("should return 'true' when xpath rule passed matches document", () => {
    const expected = true;

    const document = {};
    const rule = {
      terms: ["criteria.1"],
    };

    xp.select.mockImplementation(() => true);

    const actual = checkRule(document, rule, false);

    expect(actual).toEqual(expected);
  });

  test("should return 'true' when any of the xpath rules passed matches document", () => {
    const expected = true;

    const document = {};
    const rule = {
      terms: ["criteria.1", "criteria.2"],
    };

    xp.select.mockImplementation((rule) => rule === "criteria.2");

    const actual = checkRule(document, rule, false);

    expect(actual).toEqual(expected);
  });
});

describe("applyRule", () => {
  const sizes = {
    xs: 0,
    sm: 500,
    md: 700,
    lg: 0,
    xlg: 0,
  };

  test("should return 'undefined' when no args are passed", () => {
    const expected = undefined;

    const actual = applyRule();

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
    const actual = applyRule(document, filename);

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
        terms: ["criteria.1", "criteria.2"],
        target: "sm",
      },
    ];

    xp.select.mockImplementation((rule) => true);

    applyRule(document, filename, rules, sizes, false);

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
        terms: ["criteria.1", "criteria.2"],
        target: "md",
      },
    ];

    xp.select.mockImplementation((rule) => true);

    applyRule(document, filename, rules, sizes, false);

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
        terms: ["criteria.1", "criteria.2"],
        target: "md",
      },
    ];

    xp.select.mockImplementation((rule) => false);

    applyRule(document, filename, rules, sizes, false);

    const actual = mockSetAttribute.mock.calls.length;

    expect(actual).toEqual(expected);
  });

  test("should only match the first rule when the first rule is passed", () => {
    const expected = 1;

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
        terms: ["criteria.1"],
        target: "md",
      },
      {
        width: "> 768",
        terms: ["criteria.1"],
        target: "md",
      },
    ];

    xp.select.mockImplementation((rule) => true);

    applyRule(document, filename, rules, sizes, false);

    const actual = mockSetAttribute.mock.calls.length;

    expect(actual).toEqual(expected);
  });
});
