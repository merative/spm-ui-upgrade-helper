const xp = require("xpath");
const http = require("http");
const path = require('path');
const fs = require('fs');
const xmldom = require("xmldom");
const utils = require("../../shared-utils/sharedUtils.js");
const fileio = { readLines: utils.readLines };


const {
  applyRules,
  checkUIMDomainsAreValidToResizeDown,
  getRootNodeFromUIM
} = require("./engine");

const testDirectory = path.join(__dirname, "../test-data-domainsCheck");

const testFiles = [];
fs.readdirSync(testDirectory).forEach(file => {
  testFiles.push(path.join(testDirectory, file));
});

const parser = new xmldom.DOMParser();

jest.mock('./httpUtils', () => (
  {
  __esModule: true,
  doRequest: jest.fn((connection, filename) => {
    let result;
    // NOTE: This is where we set the value for test scenarios!!
    switch (true) {
      case (filename.startsWith("NoneAllowed")):
        result = false;
        break;
        case (filename.startsWith("AllAllowed")):
          result = true;
        break;
        case (filename.startsWith("SomeAllowed")):
        if (connection.property.startsWith("allowed")) {
          result = true;
        } else {
          result = false;
        }
        break;
      default:
        result = true;
    }
    return result;
  }),
}));

describe("checkUIMDomainsAreValidToResizeDown", () => {

  test("checkUIMDomainsAreValidToResizeDown, each file", async () => {
      const files = testFiles;
        let testFile;
        let rootNode;
        let domainsCheckPassed;

        testFile = files[1];
        rootNode = getRootNodeFromUIM(testFile, parser, fileio);
        domainsCheckPassed = await checkUIMDomainsAreValidToResizeDown(rootNode, testFile);
        expect(domainsCheckPassed).toEqual(true);
     

      testFile = files[2];
      rootNode = getRootNodeFromUIM(testFile, parser, fileio);
      domainsCheckPassed = await checkUIMDomainsAreValidToResizeDown(rootNode, testFile);
      expect(domainsCheckPassed).toEqual(true);


      testFile = files[3];
      rootNode = getRootNodeFromUIM(testFile, parser, fileio);
      domainsCheckPassed = await checkUIMDomainsAreValidToResizeDown(rootNode, testFile);
      expect(domainsCheckPassed).toEqual(false);
      
      testFile = files[4];
      rootNode = getRootNodeFromUIM(testFile, parser, fileio);
      domainsCheckPassed = await checkUIMDomainsAreValidToResizeDown(rootNode, testFile);
      expect(domainsCheckPassed).toEqual(false);
  });
});

describe("applyRules, domainCheck", () => {
  const sizes = {
    xs: 0,
    sm: 500,
    md: 700,
    lg: 1000,
    xlg: 1200,
  };
  const rules = [
    {
      width: "> 768",
      anyTerms: ["criteria.1"],
      allTerms: ["criteria.3"],
      target: "md",
    },
  ];
  

  test("domainCheck for all rules on all files in test folder", async () => {
      let serilizationCalls = 0;
       const mockSerializeToString = function() {
         serilizationCalls ++;
       };
        const serializer = {
          serializeToString: mockSerializeToString,
        };
      
        await applyRules(testFiles, rules, sizes, fileio, parser, serializer, true, true);
       
  });
});
