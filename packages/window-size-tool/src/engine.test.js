const xp = require("xpath");

const {
  checkWidth,
  checkPageWidth,
  checkLinkWidth,
  checkRule,
  updateWidthOption,
  applyRule,
  applyRules,
} = require("./engine");

jest.mock("xpath");

describe("checkWidth", () => {
  test("should throw an error when no width is supplied", () => {
    const actual = () => checkWidth();

    expect(actual).toThrow();
  });

  test("should throw an error when no rule is supplied", () => {
    const width = 400;
    const actual = () => checkWidth(width);

    expect(actual).toThrow();
  });

  test('should return "false" when width is "400" and the rule is "< 300"', () => {
    const expected = false;

    const width = 400;
    const rule = "< 300";
    const verbose = false;
    const actual = checkWidth(width, rule, verbose);

    expect(actual).toEqual(expected);
  });

  test('should return "false" when width is "400" and the rule is "> 500"', () => {
    const expected = false;

    const width = 400;
    const rule = "> 500";
    const verbose = false;
    const actual = checkWidth(width, rule, verbose);

    expect(actual).toEqual(expected);
  });

  test('should return "true" when width is "400" and the rule is ">= 400"', () => {
    const expected = true;

    const width = 400;
    const rule = ">= 400";
    const verbose = false;
    const actual = checkWidth(width, rule, verbose);

    expect(actual).toEqual(expected);
  });

  test('should return "false" when width is "100" and the rule is ">= 200 and <= 300"', () => {
    const expected = false;

    const width = 100;
    const rule = ">= 200 and <= 300";
    const verbose = false;
    const actual = checkWidth(width, rule, verbose);

    expect(actual).toEqual(expected);
  });

  test('should return "false" when width is "400" and the rule is ">= 200 and <= 300"', () => {
    const expected = false;

    const width = 400;
    const rule = ">= 200 and <= 300";
    const verbose = false;
    const actual = checkWidth(width, rule, verbose);

    expect(actual).toEqual(expected);
  });

  test('should return "false" when width is "250" and the rule is ">= 200 and <= 300"', () => {
    const expected = true;

    const width = 250;
    const rule = ">= 200 and <= 300";
    const verbose = false;
    const actual = checkWidth(width, rule, verbose);

    expect(actual).toEqual(expected);
  });
});

describe("checkPageWidth", () => {
  test("should throw an error when no width is supplied", () => {
    const actual = () => checkPageWidth();

    expect(actual).toThrow();
  });

  test("should throw an error when no rule is supplied", () => {
    const width = 400;
    const actual = () => checkPageWidth(width);

    expect(actual).toThrow();
  });

  test('should return "false" when width is "400" and the rule is "< 300"', () => {
    const expected = false;

    const pageNode = {
      getAttribute: () => "width=400",
    };
    const rule = "< 300";
    const verbose = false;
    const actual = checkPageWidth(pageNode, rule, verbose);

    expect(actual).toEqual(expected);
  });

  test('should return "false" when width is "400" and the rule is "> 500"', () => {
    const expected = false;

    const pageNode = {
      getAttribute: () => "width=400",
    };
    const rule = "> 500";
    const verbose = false;
    const actual = checkPageWidth(pageNode, rule, verbose);

    expect(actual).toEqual(expected);
  });

  test('should return "true" when width is "400" and the rule is ">= 400"', () => {
    const expected = true;

    const pageNode = {
      getAttribute: () => "width=400",
    };
    const rule = ">= 400";
    const verbose = false;
    const actual = checkPageWidth(pageNode, rule, verbose);

    expect(actual).toEqual(expected);
  });

  test('should return "false" when width is "100" and the rule is ">= 200 and <= 300"', () => {
    const expected = false;

    const pageNode = {
      getAttribute: () => "width=100",
    };
    const rule = ">= 200 and <= 300";
    const verbose = false;
    const actual = checkPageWidth(pageNode, rule, verbose);

    expect(actual).toEqual(expected);
  });

  test('should return "false" when width is "400" and the rule is ">= 200 and <= 300"', () => {
    const expected = false;

    const pageNode = {
      getAttribute: () => "width=400",
    };
    const rule = ">= 200 and <= 300";
    const verbose = false;
    const actual = checkPageWidth(pageNode, rule, verbose);

    expect(actual).toEqual(expected);
  });

  test('should return "false" when width is "250" and the rule is ">= 200 and <= 300"', () => {
    const expected = true;

    const pageNode = {
      getAttribute: () => "width=250",
    };
    const rule = ">= 200 and <= 300";
    const verbose = false;
    const actual = checkPageWidth(pageNode, rule, verbose);

    expect(actual).toEqual(expected);
  });
});

describe("checkLinkWidth", () => {
  beforeEach(() => {
    xp.select.mockReset();
  });

  test("should throw an error when no PAGE node is supplied", () => {
    const actual = () => checkLinkWidth();

    expect(actual).toThrow();
  });

  test("should throw an error when no rule is supplied", () => {
    const pageNode = {};
    const actual = () => checkLinkWidth(pageNode);

    expect(actual).toThrow();
  });

  test("should return an empty array when WINDOW_OPTIONS is null", () => {
    const mockGetAttribute = (attribute) => {
      if (attribute === "PAGE_ID") {
        return "test-id";
      } else if (attribute === "WINDOW_OPTIONS") {
        return null;
      }
    };

    const expected = [];

    const pageNode = {};
    xp.select.mockImplementation(() => [
      {
        getAttribute: mockGetAttribute,
      },
    ]);
    const rule = ">= 400";
    const verbose = false;
    const actual = checkLinkWidth(pageNode, rule, verbose);

    expect(actual).toEqual(expected);
  });

  test('should return an empty array when the link\'s width is "300" and the rule is ">= 400"', () => {
    const mockGetAttribute = (attribute) => {
      if (attribute === "PAGE_ID") {
        return "test-id";
      } else if (attribute === "WINDOW_OPTIONS") {
        return "width=300";
      }
    };

    const expected = [];
    xp.select.mockImplementation(() => [
      {
        getAttribute: mockGetAttribute,
      },
    ]);

    const pageNode = {
      getAttribute: () => null,
    };
    const rule = { width: ">= 400" };
    const verbose = false;
    const actual = checkLinkWidth(pageNode, rule, verbose);

    expect(actual).toEqual(expected);
  });

  test('should return a matching link when the link\'s width is "400" and the rule is ">= 400"', () => {
    const mockGetAttribute = (attribute) => {
      if (attribute === "PAGE_ID") {
        return "test-id";
      } else if (attribute === "WINDOW_OPTIONS") {
        return "width=400";
      }
    };

    const expected = [
      {
        link: {
          getAttribute: mockGetAttribute,
        },
        options: {
          width: "400",
        },
        pageId: "test-id",
      },
    ];
    xp.select.mockImplementation(() => [
      {
        getAttribute: mockGetAttribute,
      },
    ]);

    const pageNode = {};
    const rule = { width: ">= 400" };
    const verbose = false;
    const actual = checkLinkWidth(pageNode, rule, verbose);

    expect(actual).toEqual(expected);
  });
});

describe("checkRule", () => {
  test("should throw an error when no node is supplied", () => {
    const actual = () => checkRule();

    expect(actual).toThrow();
  });

  test("should throw an error when a rule object is not supplied", () => {
    const node = {};
    const actual = () => checkRule(node);

    expect(actual).toThrow();
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

describe("updateWidthOption", () => {
  test("should throw an error when no WINDOW_OPTIONS string is supplied", () => {
    const actual = () => updateWidthOption();

    expect(actual).toThrow();
  });

  test("should throw an error when no sizes object is supplied", () => {
    const windowOptions = {};
    const actual = () => updateWidthOption(windowOptions);

    expect(actual).toThrow();
  });

  test("should throw an error when no target size category is supplied", () => {
    const windowOptions = {};
    const sizes = {};
    const actual = () => updateWidthOption(windowOptions, sizes);

    expect(actual).toThrow();
  });

  test('should return \'{ width: "1000" }\' when sizes and target "lg" is passed', () => {
    const expected = {
      width: 1000,
    };

    const windowOptions = {};
    const sizes = {
      lg: 1000,
    };
    const target = "lg";
    updateWidthOption(windowOptions, sizes, target);
    const actual = windowOptions;

    expect(actual).toEqual(expected);
  });

  test('should return \'{ size: "lg" }\' when sizes and target "lg" is passed and usePixelWidths is set to "false"', () => {
    const expected = {
      size: "lg",
    };

    const windowOptions = {};
    const sizes = {
      lg: "1000",
    };
    const target = "lg";
    updateWidthOption(windowOptions, sizes, target, false);
    const actual = windowOptions;

    expect(actual).toEqual(expected);
  });
});

describe("applyRule", () => {
  const filename = "test.uim";
  const sizes = {
    xs: 0,
    sm: 500,
    md: 700,
    lg: 1000,
    xlg: 1200,
  };

  beforeEach(() => {
    xp.select.mockReset();
  });

  test("should throw an error when no document is passed", () => {
    const actual = () => applyRule();

    expect(actual).toThrow();
  });

  test("should throw an error when no filename is passed", () => {
    const document = {};
    const actual = () => applyRule(document);

    expect(actual).toThrow();
  });

  test("should throw an error when no rules are passed", () => {
    const document = {};
    const actual = () => applyRule(document, filename);

    expect(actual).toThrow();
  });

  test("should throw an error when no sizes are passed", () => {
    const document = {};
    const rules = [];
    const actual = () => applyRule(document, filename, rules);

    expect(actual).toThrow();
  });

  test("should throw an error when no PAGE dictionary is passed", () => {
    const document = {};
    const rules = [];
    const actual = () => applyRule(document, filename, rules, sizes);

    expect(actual).toThrow();
  });

  test('should not update the document and return "false" when no rules are passed', () => {
    const expected = false;

    const mockSetAttribute = jest.fn();
    const document = {
      documentElement: {
        setAttribute: mockSetAttribute,
      },
    };
    const rules = [];
    const pagedictionary = {};

    xp.select.mockImplementation(() => [
      {
        setAttribute: mockSetAttribute,
      },
    ]);
    const actual = applyRule(
      document,
      filename,
      rules,
      sizes,
      pagedictionary,
      false
    );

    expect(actual).toEqual(expected);
    expect(mockSetAttribute.mock.calls.length).toEqual(0);
  });

  test("should update width to 'small' size when width '600' matches the rule '> 576 and <= 768' and terms pass", () => {
    const expected = true;

    const mockSetAttribute = jest.fn();
    const document = {
      documentElement: {
        getAttribute: () => "width=600",
        setAttribute: mockSetAttribute,
      },
    };
    const rules = [
      {
        width: "> 576 and <= 768",
        terms: ["criteria.1", "criteria.2"],
        target: "sm",
      },
    ];
    const pagedictionary = {};

    xp.select.mockImplementation((xPath) =>
      xPath.includes("LINK") ? [] : true
    );
    const actual = applyRule(
      document,
      filename,
      rules,
      sizes,
      pagedictionary,
      false
    );

    expect(actual).toEqual(expected);

    const [property, result] = mockSetAttribute.mock.calls[0];
    expect(result).toEqual(`width=${sizes.sm}`);
  });

  test("should update width to 'medium' size when width '800' matches the rule '> 768' and terms pass", () => {
    const expected = true;

    const mockSetAttribute = jest.fn();
    const document = {
      documentElement: {
        getAttribute: () => "width=800",
        setAttribute: mockSetAttribute,
      },
    };
    const rules = [
      {
        width: "> 768",
        terms: ["criteria.1", "criteria.2"],
        target: "md",
      },
    ];
    const pagedictionary = {};

    xp.select.mockImplementation((xPath) =>
      xPath.includes("LINK") ? [] : true
    );
    const actual = applyRule(
      document,
      filename,
      rules,
      sizes,
      pagedictionary,
      false
    );

    expect(actual).toEqual(expected);

    const [property, result] = mockSetAttribute.mock.calls[0];
    expect(result).toEqual(`width=${sizes.md}`);
  });

  test("should not update width when width '800' matches the rule '> 768' but terms are not met", () => {
    const expected = false;

    const mockSetAttribute = jest.fn();
    const document = {
      documentElement: {
        getAttribute: () => "width=800",
        setAttribute: mockSetAttribute,
      },
    };
    const rules = [
      {
        width: "> 768",
        terms: ["criteria.1", "criteria.2"],
        target: "md",
      },
    ];
    const pagedictionary = {};

    xp.select.mockImplementation((xPath) =>
      xPath.includes("LINK") ? [] : false
    );
    const actual = applyRule(
      document,
      filename,
      rules,
      sizes,
      pagedictionary,
      false
    );

    expect(actual).toEqual(expected);

    const result = mockSetAttribute.mock.calls.length;
    expect(result).toEqual(0);
  });

  test("should only match the first rule when the first rule is passed", () => {
    const mockSetAttribute = jest.fn();
    const document = {
      documentElement: {
        getAttribute: () => "width=800",
        setAttribute: mockSetAttribute,
      },
    };
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
    const pagedictionary = {};

    xp.select.mockImplementation((xPath) =>
      xPath.includes("LINK") ? [] : true
    );
    const actual = applyRule(
      document,
      filename,
      rules,
      sizes,
      pagedictionary,
      false
    );

    const result = mockSetAttribute.mock.calls.length;
    expect(result).toEqual(1);
  });
});
