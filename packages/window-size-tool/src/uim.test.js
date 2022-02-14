const xp = require("xpath");

const {
  optionsObjectToString,
  optionsStringToObject,
  getWindowOptions,
  getPageOptions,
  getLinkOptions,
  setWindowOptions,
  setPageOptions,
  setLinkOptions,
} = require("./uim");

jest.mock("xpath");

describe("optionsObjectToString", () => {
  test("should throw an error when no WINDOW_OPTIONS object is supplied", () => {
    const actual = () => optionsObjectToString();

    expect(actual).toThrow();
  });

  test("should return an empty string when empty object is passed", () => {
    const expected = "";

    const optionsObject = {};
    const actual = optionsObjectToString(optionsObject);

    expect(actual).toEqual(expected);
  });

  test('should return "width=400" when \'{ width: "400" }\' is passed', () => {
    const expected = "width=400";

    const optionsObject = { width: "400" };
    const actual = optionsObjectToString(optionsObject);

    expect(actual).toEqual(expected);
  });

  test('should return "height=400,width=400" when \'{ height: "400", width: "400" }\' is passed', () => {
    const expected = "height=400,width=400";

    const optionsObject = {
      height: "400",
      width: "400",
    };
    const actual = optionsObjectToString(optionsObject);

    expect(actual).toEqual(expected);
  });
});

describe("optionsStringToObject", () => {
  test("should throw an error when no WINDOW_OPTIONS object is supplied", () => {
    const actual = () => optionsStringToObject();

    expect(actual).toThrow();
  });

  test("should return an empty object when empty string is passed", () => {
    const expected = {};

    const optionsString = "";
    const actual = optionsStringToObject(optionsString);

    expect(actual).toEqual(expected);
  });

  test('should return \'{ width: "400" }\' when "width=400" is passed', () => {
    const expected = { width: "400" };

    const optionsString = "width=400";
    const actual = optionsStringToObject(optionsString);

    expect(actual).toEqual(expected);
  });

  test('should return \'{ height: "400", width: "400" }\' when "height=400,width=400" is passed', () => {
    const expected = {
      height: "400",
      width: "400",
    };

    const optionsString = "height=400,width=400";
    const actual = optionsStringToObject(optionsString);

    expect(actual).toEqual(expected);
  });
});

describe("getWindowOptions", () => {
  test("should throw an error when no node is supplied", () => {
    const actual = () => getWindowOptions();

    expect(actual).toThrow();
  });

  test("should return null when a node has no WINDOW_OPTIONS set", () => {
    const expected = null;

    const node = {
      getAttribute: () => null,
    };
    const actual = getWindowOptions(node);

    expect(actual).toEqual(expected);
  });

  test('should return \'{ "height": "400" }\' when a node with WINDOW_OPTIONS set to "height=400" is passed', () => {
    const expected = { height: "400" };

    const node = {
      getAttribute: () => "height=400",
    };
    const actual = getWindowOptions(node);

    expect(actual).toEqual(expected);
  });

  test('should return \'{ "width": "400", "height": "400" }\' when a node with WINDOW_OPTIONS set to "width=400, height=400" is passed', () => {
    const expected = { width: "400", height: "400" };

    const node = {
      getAttribute: () => "width=400, height=400",
    };
    const actual = getWindowOptions(node);

    expect(actual).toEqual(expected);
  });
});

describe("getPageOptions", () => {
  test("should throw an error when no PAGE node is supplied", () => {
    const actual = () => getPageOptions();

    expect(actual).toThrow();
  });

  test("should return null when a PAGE node has no WINDOW_OPTIONS set", () => {
    const expected = null;

    const pageNode = {
      getAttribute: () => null,
    };
    const actual = getPageOptions(pageNode);

    expect(actual).toEqual(expected);
  });

  test('should return \'{ "height": "400" }\' when a PAGE node with WINDOW_OPTIONS set to "height=400" is passed', () => {
    const expected = { height: "400" };

    const pageNode = {
      getAttribute: () => "height=400",
    };
    const actual = getPageOptions(pageNode);

    expect(actual).toEqual(expected);
  });

  test('should return \'{ "width": "400", "height": "400" }\' when a PAGE node with WINDOW_OPTIONS set to "width=400, height=400" is passed', () => {
    const expected = { width: "400", height: "400" };

    const pageNode = {
      getAttribute: () => "width=400, height=400",
    };
    const actual = getPageOptions(pageNode);

    expect(actual).toEqual(expected);
  });
});

describe("getLinkOptions", () => {
  beforeEach(() => {
    xp.select.mockReset();
  });

  test("should throw an error when no PAGE node is supplied", () => {
    const actual = () => getLinkOptions();

    expect(actual).toThrow();
  });

  test("should return null when a node has no PAGE_ID set", () => {
    const pageNode= {};
    const actual = getLinkOptions(pageNode);
    const expected = [];
    expect(actual).toEqual(expected);
  });

  test("should return a link object when a PAGE node contains a LINK element", () => {
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

    const pageNode = {};
    xp.select.mockImplementation(() => [
      {
        getAttribute: mockGetAttribute,
      },
    ]);

    const actual = getLinkOptions(pageNode);

    expect(actual).toEqual(expected);
  });

  test("should return 2 link objects when a PAGE node contains 2 LINK elements", () => {
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

    const pageNode = {};
    xp.select.mockImplementation(() => [
      {
        getAttribute: mockGetAttribute,
      },
      {
        getAttribute: mockGetAttribute,
      },
    ]);

    const actual = getLinkOptions(pageNode);

    expect(actual).toEqual(expected);
  });
});

describe("setWindowOptions", () => {
  test("should throw an error when no node is supplied", () => {
    const actual = () => setWindowOptions();

    expect(actual).toThrow();
  });

  test("should set WINDOW_OPTIONS to an empty string when an empty WINDOW_OPTIONS object is passed", () => {
    const expected = "";

    const mockSetAttribute = jest.fn();
    const node = {
      setAttribute: mockSetAttribute,
    };
    setWindowOptions(node, {});
    const [property, actual] = mockSetAttribute.mock.calls[0];

    expect(actual).toEqual(expected);
  });

  test('should set WINDOW_OPTIONS to "width=400" when \'{ width: "400" }\' is passed', () => {
    const expected = "width=400";

    const mockSetAttribute = jest.fn();
    const node = {
      setAttribute: mockSetAttribute,
    };
    setWindowOptions(node, { width: 400 });
    const [property, actual] = mockSetAttribute.mock.calls[0];

    expect(actual).toEqual(expected);
  });

  test('should set WINDOW_OPTIONS to "height=400,width=400" when \'{ height "400", width: "400" }\' is passed', () => {
    const expected = "height=400,width=400";

    const mockSetAttribute = jest.fn();
    const node = {
      setAttribute: mockSetAttribute,
    };
    setWindowOptions(node, { height: 400, width: 400 });
    const [property, actual] = mockSetAttribute.mock.calls[0];

    expect(actual).toEqual(expected);
  });
});

describe("setPageOptions", () => {
  test("should throw an error when no PAGE node is supplied", () => {
    const actual = () => setPageOptions();

    expect(actual).toThrow();
  });

  test("should set WINDOW_OPTIONS to an empty string when an empty WINDOW_OPTIONS object is passed", () => {
    const expected = "";

    const mockSetAttribute = jest.fn();
    const node = {
      setAttribute: mockSetAttribute,
    };
    setPageOptions(node, {});
    const [property, actual] = mockSetAttribute.mock.calls[0];

    expect(actual).toEqual(expected);
  });

  test('should set WINDOW_OPTIONS to "width=400" when \'{ width: "400" }\' is passed', () => {
    const expected = "width=400";

    const mockSetAttribute = jest.fn();
    const node = {
      setAttribute: mockSetAttribute,
    };
    setPageOptions(node, { width: 400 });
    const [property, actual] = mockSetAttribute.mock.calls[0];

    expect(actual).toEqual(expected);
  });

  test('should set WINDOW_OPTIONS to "height=400,width=400" when \'{ height "400", width: "400" }\' is passed', () => {
    const expected = "height=400,width=400";

    const mockSetAttribute = jest.fn();
    const node = {
      setAttribute: mockSetAttribute,
    };
    setPageOptions(node, { height: 400, width: 400 });
    const [property, actual] = mockSetAttribute.mock.calls[0];

    expect(actual).toEqual(expected);
  });
});

describe("setLinkOptions", () => {
  test("should throw an error when no LINK node is supplied", () => {
    const actual = () => setPageOptions();

    expect(actual).toThrow();
  });

  test("should set WINDOW_OPTIONS to an empty string when an empty WINDOW_OPTIONS object is passed", () => {
    const expected = "";

    const mockSetAttribute = jest.fn();
    const node = {
      setAttribute: mockSetAttribute,
    };
    setLinkOptions(node, {});
    const [property, actual] = mockSetAttribute.mock.calls[0];

    expect(actual).toEqual(expected);
  });

  test('should set WINDOW_OPTIONS to "width=400" when \'{ width: "400" }\' is passed', () => {
    const expected = "width=400";

    const mockSetAttribute = jest.fn();
    const node = {
      setAttribute: mockSetAttribute,
    };
    setLinkOptions(node, { width: 400 });
    const [property, actual] = mockSetAttribute.mock.calls[0];

    expect(actual).toEqual(expected);
  });

  test('should set WINDOW_OPTIONS to "height=400,width=400" when \'{ height "400", width: "400" }\' is passed', () => {
    const expected = "height=400,width=400";

    const mockSetAttribute = jest.fn();
    const node = {
      setAttribute: mockSetAttribute,
    };
    setLinkOptions(node, { height: 400, width: 400 });
    const [property, actual] = mockSetAttribute.mock.calls[0];

    expect(actual).toEqual(expected);
  });
});
