const xp = require("xpath");
const path = require('path');
const fs = require('fs');
const xmldom = require("xmldom");
const utils = require("../../shared-utils/sharedUtils.js");
const fileio = { readLines: utils.readLines };

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
  test("should throw an error when no node is supplied", async() => {
    try {
      await checkRule();
    } catch(e) {
      expect(e).toEqual(new Error("You must supply a node"));
    }
  });

  test("should throw an error when a rule object is not supplied", async() => {
    try {
      await checkRule(node);
    } catch(e) {
      expect(e).toEqual(new Error("node is not defined"));
    }
  });

  test("should return 'false' when xpath rule passed matches document", async () => {
    const expected = false;

    const document = {};
    const rule = {
      anyTerms: ["criteria.1"],
      allTerms: ["criteria.3"],
    };

    xp.select.mockImplementation(() => false);

    const actual = await checkRule(document, "test.uim", rule, false, false);

    expect(actual).toEqual(expected);
  });

  test("should return 'true' when xpath rule passed matches document and there is no INCLUDES and WIZARD_PROGRESS_BAR", async() => {
    const expected = true;

    const document = {};
    const rule = {
      anyTerms: ["criteria.1"],
      allTerms: ["criteria.3"],
    };

    xp.select.mockImplementation(() => true);

    const actual = await checkRule(document, "test.uim", rule, false, false);

    expect(actual).toEqual(expected);
  });

  test("should return 'true' when any of the xpath rules passed matches document and there is no INCLUDES and WIZARD_PROGRESS_BAR", async () => {
    const expected = true;

    const document = {};
    const rule = {
      anyTerms: ["criteria.1", "criteria.2"],
      allTerms:  ["criteria.3"],
    };

    xp.select.mockImplementation((rule) => true);

    const actual = await checkRule(document, "test.uim", rule, false, false);

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
    const usePixelWidths = true;
    updateWidthOption(windowOptions, sizes, target, usePixelWidths, false);
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
    const usePixelWidths = false;
    updateWidthOption(windowOptions, sizes, target, usePixelWidths);
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
  const serializer = {
    serializeToString: jest.fn(),
  };

  beforeEach(() => {
    xp.select.mockReset();
    document = undefined;
  });

  test("should throw an error when no document is passed", async() => {
    try {
      await applyRule();
    } catch(e) {
      expect(e).toEqual(new Error("You must supply a UIM document"));
    }
  });

  test("should throw an error when no filename is passed", async() => {
    const document = {};
    try {
      await applyRule(document);
    } catch(e) {
      expect(e).toEqual(new Error("You must supply a filename"));
    }
  });

  test("should throw an error when no rules are passed", async() => {
    const document = {};
    try {
      await applyRule(document, filename, serializer);
    } catch(e) {
      expect(e).toEqual(new Error("You must supply a rules array"));
    }
  });

  test("should throw an error when no sizes are passed", async() => {
    const document = {};
    const rules = [];
    try {
      await applyRule(document, filename, serializer, rules);
    } catch(e) {
      expect(e).toEqual(new Error("You must supply a size object"));
    }
  });

  test("should throw an error when no PAGE dictionary is passed", async() => {
    const document = {};
    const rules = [];
    try {
      await applyRule(document, filename, serializer, rules, sizes);
    } catch(e) {
      expect(e).toEqual(new Error("You must supply a PAGE dictionary map"));
    }
  });

  test('should not update the document and return "false" when no rules are passed', async() => {
    const expected = false;

    const mockSetAttribute = jest.fn();
    const document = {
      documentElement: {
        setAttribute: mockSetAttribute,
      },
    };
    const rules = [];
    const pagedictionary = {};
    const usePixelWidths = true;

    xp.select.mockImplementation(() => [
      {
        setAttribute: mockSetAttribute,
      },
    ]);
    const actual = await applyRule(
      document,
      filename,
      serializer,
      rules,
      sizes,
      pagedictionary,
      usePixelWidths,
      false,
      false
    );

    expect(actual).toEqual(expected);
    expect(mockSetAttribute.mock.calls.length).toEqual(0);
  });

  test("should update width to 'small' size when width '600' matches the rule '> 576 and <= 768' and terms pass", async() => {
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
        anyTerms: ["criteria.1", "criteria.2"],
        allTerms:  ["criteria.3"],
        target: "sm",
      },
    ];
    const pagedictionary = {};
    const usePixelWidths = true;

    xp.select.mockImplementation((xPath) =>
      xPath.includes("LINK") ? [] : true
    );
    const actual = await applyRule(
      document,
      filename,
      serializer,
      rules,
      sizes,
      pagedictionary,
      usePixelWidths,
      false,
      false,
      true
    );
    
    expect(actual).toEqual(expected);

    const [property, result] = mockSetAttribute.mock.calls[0];
    expect(result).toEqual(`width=${sizes.sm}`);
   
  });

  test("should update width to 'medium' size when width '800' matches the rule '> 768' and terms pass", async() => {
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
        anyTerms: ["criteria.1", "criteria.2"],
        allTerms:  ["criteria.3"],
        target: "md",
      },
    ];
    const pageDictionary = {};
    const usePixelWidths = true;

    xp.select.mockImplementation((xPath) =>
      xPath.includes("LINK") ? [] : true
    );
    const actual = await applyRule(
      document,
      filename,
      serializer,
      rules,
      sizes,
      pageDictionary,
      usePixelWidths,
      false,
      false,
      true
    );

    expect(actual).toEqual(expected);

    const [property, result] = mockSetAttribute.mock.calls[0];
    expect(result).toEqual(`width=${sizes.md}`);
  });

  test("should not update width when width '800' matches the rule '> 768' but terms are not met", async() => {
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
        anyTerms: ["criteria.1", "criteria.2"],
        allTerms:  ["criteria.3"],
        target: "md",
      },
    ];
    const pagedictionary = {};
    const usePixelWidths = true;

    xp.select.mockImplementation((xPath) =>
      xPath.includes("LINK") ? [] : false
    );
    const actual = await applyRule(
      document,
      filename,
      serializer,
      rules,
      sizes,
      pagedictionary,
      usePixelWidths,
      false,
      false
    );

    expect(actual).toEqual(expected);

    const result = mockSetAttribute.mock.calls.length;
    expect(result).toEqual(0);
  });

  test("should only match the first rule when the first rule is passed", async() => {
    const mockSetAttribute = jest.fn();
    let document = {
      documentElement: {
        getAttribute: () => "width=800",
        setAttribute: mockSetAttribute,
      },
    };
    const rules = [
      {
        width: "> 768",
        anyTerms: ["criteria.1"],
        allTerms: ["criteria.3"],
        target: "md",
      },
      {
        width: "> 768",
        anyTerms: ["criteria.1"],
        allTerms: ["criteria.3"],
        target: "md",
      },
    ];
    const pagedictionary = {};
    const usePixelWidths = true;

    xp.select.mockImplementation((xPath) =>
      xPath.includes("LINK") ? [] : true
    );
    const actual = await applyRule(
      document,
      filename,
      serializer,
      rules,
      sizes,
      pagedictionary,
      usePixelWidths,
      false, 
      false
    );

    const result = mockSetAttribute.mock.calls.length;
    expect(result).toEqual(2);
  });
});

describe("applyRules", () => {
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

  test("should throw an error when no files are passed", async () => {
     let error;
     try{ await applyRules(files);} catch (e){ error = e;}
     expect(error).toEqual(new Error("files is not defined"));
  });

  test("should throw an error when no rules is passed", async () => {
     const files = [];
     let error;
     try{ await applyRules(files);} catch (e){ error = e;}
     expect(error).toEqual(new Error("You must supply a rules array"));
   });

  test("should throw an error when no sizes are passed", async () => {
     const files = [];
     const rules =[];
     let error;
     try{ await applyRules(files, rules);} catch (e){ error = e;}
     expect(error).toEqual(new Error("You must supply a size object"));
 });


  test("should throw an error when no io is passed", async () => {
    const files = [];
    const rules =[];
    const size ="md";
    let error;
    try{ await applyRules(files, rules, size);} catch (e){ error = e;}
    expect(error).toEqual(new Error("You must supply an io object"));
  });

  test("should throw an error when no parser is passed", async () => {
    const files = [];
    const rules =[];
    const size ="md";
    const io = {};
    let error;
    try{ await applyRules(files, rules, size, io);} catch (e){ error = e;}
    expect(error).toEqual(new Error("You must supply an parser object"));
  });

  test("should throw an error when no serializer is passed", async() => {
    const files = [];
    const rules =[];
    const size ="md";
    const io = {};
    const parser ={};
    let error;
    try{ await applyRules(files, rules, size, io, parser);} catch (e){ error = e;}
    expect(error).toEqual(new Error("You must supply an serializer object"));
  });

  test("should serialize UIM documents to strings when the document matches the rules", async() => {
    const expected = true;

    const mockSerializeToString = jest.fn();

    const files = ["test.uim"];
    const rules = [
      {
        width: "> 768",
        anyTerms: ["criteria.1"],
        allTerms: ["criteria.3"],
        target: "md",
      },
    ];
    const io = {
      readLines: (file) => [],
    };
    const parser = {
      parseFromString: (contents) => ({
        documentElement: {
          getAttribute: (attribute) => {
            if (attribute === "PAGE_ID") {
              return "test-id";
            } else if (attribute === "WINDOW_OPTIONS") {
              return null;
            }
          },
        },
      }),
    };
    const serializer = {
      serializeToString: mockSerializeToString,
    };
    const usePixelWidths = true;

    xp.select.mockImplementation((xPath) => {
      if (xPath.includes("LINK")) {
        return [
          {
            getAttribute: (attribute) => {
              if (attribute === "PAGE_ID") {
                return "test-id";
              } else if (attribute === "WINDOW_OPTIONS") {
                return "width=999";
              }
            },
            setAttribute: () => {},
          },
        ];
      } else {
        return true;
      }
    });

    await applyRules(files, rules, sizes, io, parser, serializer, usePixelWidths, false, false);
    const actual = mockSerializeToString.mock.calls.length > 0;

    expect(actual).toEqual(expected);
  });
});
