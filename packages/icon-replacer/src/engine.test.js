const assert = require("assert");
const engine = require("./engine");

describe("getMapping", () => {
  const { getMapping } = engine;

  it("no params returns null", async () => {
    const expected = null;

    const actual = getMapping();

    assert.strictEqual(actual, expected);
  });

  it("filename and no mappings returns null", async () => {
    const expected = null;

    const filename = "icon.png";

    const actual = getMapping(filename);

    assert.strictEqual(actual, expected);
  });

  it("filename and empty mappings object returns null", async () => {
    const expected = null;

    const filename = "icon.png";
    const mappings = {};

    const actual = getMapping(filename, mappings);

    assert.strictEqual(actual, expected);
  });

  it("filename and no matching mappings returns null", async () => {
    const expected = null;

    const filename = "icon.png";
    const mappings = {
      "icon.gif": "icon.a.svg",
      "icon.jpg": "icon.b.svg",
    };

    const actual = getMapping(filename, mappings);

    assert.strictEqual(actual, expected);
  });

  it("filename and matching mapping returns correct mapping", async () => {
    const expected = "icon.c.svg";

    const filename = "icon.png";
    const mappings = {
      "icon.gif": "icon.a.svg",
      "icon.jpg": "icon.b.svg",
      "icon.png": "icon.c.svg",
    };

    const actual = getMapping(filename, mappings);

    assert.strictEqual(actual, expected);
  });
});

describe("updateIconReferences", () => {
  const { updateIconReferences } = engine;

  it("no params returns null", async () => {
    const expected = null;

    const actual = updateIconReferences();

    assert.strictEqual(actual, expected);
  });

  it("content and no mappings returns null", async () => {
    const expected = null;

    const content =
      '<html><body><h1>test</h1><img src="./icon.png"/></body></html>';

    const actual = updateIconReferences(content);

    assert.strictEqual(actual, expected);
  });

  it("content and empty mappings object returns null", async () => {
    const expected = null;

    const content =
      '<html><body><h1>test</h1><img src="./icon.png"/></body></html>';
    const mappings = {};

    const actual = updateIconReferences(content, mappings);

    assert.strictEqual(actual, expected);
  });

  it("content and no matching mappings returns null", async () => {
    const expected = null;

    const content =
      '<html><body><h1>test</h1><img src="./icon.png"/></body></html>';
    const mappings = {
      "icon.gif": "icon.a.svg",
      "icon.jpg": "icon.b.svg",
    };

    const actual = updateIconReferences(content, mappings);

    assert.strictEqual(actual, expected);
  });

  it("content and matching mapping returns updated content", async () => {
    const expected =
      '<html><body><h1>test</h1><img src="./icon.c.svg"/></body></html>';

    const content =
      '<html><body><h1>test</h1><img src="./icon.png"/></body></html>';
    const mappings = {
      "icon.gif": "icon.a.svg",
      "icon.jpg": "icon.b.svg",
      "icon.png": "icon.c.svg",
    };

    const actual = updateIconReferences(content, mappings);

    assert.strictEqual(actual, expected);
  });
});
