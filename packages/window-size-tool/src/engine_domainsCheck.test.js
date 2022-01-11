const xp = require("xpath");
const http = require("http");
const path = require('path');
const fs = require('fs');
const xmldom = require("xmldom");
const utils = require("../../shared-utils/sharedUtils.js");
const fileio = { readLines: utils.readLines };
const {
  getPageOptions,
  getLinkOptions,
} = require("./uim");


const {
  applyRules,
  checkUIMDomainsAreValidToResizeDown,
  getRootNodeFromUIM
} = require("./engine");

const testDirectory = path.join(__dirname, "../test-data-domainsCheck");
const testDirectoryLinksToModals = testDirectory + "/linksToModals";

const testFiles = [];
fs.readdirSync(testDirectory).forEach(file => {
  if (path.extname(file) === ".uim" || path.extname(file) === ".vim") {
    testFiles.push(path.join(testDirectory, file));
  }
});
fs.readdirSync(testDirectoryLinksToModals).forEach(file => {
  if (path.extname(file) === ".uim" || path.extname(file) === ".vim") {
    testFiles.push(path.join(testDirectoryLinksToModals, file));
  }
});

const getTestFile = (filename) => {
  for(let i = 0; i < testFiles.length; i++) {
    if (path.basename(testFiles[i]) === filename) {
      //console.log(testFiles[i]);
      return testFiles[i];
    }
    
  }
}

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

      testFile =  getTestFile("AllAllowed_TwoSourceConnections.uim");
      rootNode = getRootNodeFromUIM(testFile, parser, fileio);
      domainsCheckPassed = await checkUIMDomainsAreValidToResizeDown(rootNode, testFile);
      expect(domainsCheckPassed).toEqual(true);
     
      // TODO: Investigate why this UIM that contains a VIM is being domain checked
      // it shold NOT be because of the term "count(//INCLUDE) = 0"
      testFile =  getTestFile("AllAllowed_SourceConnectionsWithVims.uim");
      rootNode = getRootNodeFromUIM(testFile, parser, fileio);
      domainsCheckPassed = await checkUIMDomainsAreValidToResizeDown(rootNode, testFile);
      expect(domainsCheckPassed).toEqual(true);

      testFile =  getTestFile("NoneAllowed_OneSourceConnection.uim");
      rootNode = getRootNodeFromUIM(testFile, parser, fileio);
      domainsCheckPassed = await checkUIMDomainsAreValidToResizeDown(rootNode, testFile);
      expect(domainsCheckPassed).toEqual(false);
      
      testFile =  getTestFile("SomeAllowed_MultipleSourceConnections.uim");
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
  let rules = [
    {
      width: "> 768",
      anyTerms: ["criteria.1"],
      allTerms: ["criteria.3"],
      target: "md"
    },
  ];
  const realSerializer = new xmldom.XMLSerializer();
 
 
  test("domainCheck for all rules on all files in test folder",  done => {
    let results = [];
    const mockSerializeToString = function(document) {
    const serializedDoc = realSerializer.serializeToString(document);
      results.push(serializedDoc);
    };
      const serializer = {
        serializeToString: mockSerializeToString,
      };

      console.log(testFiles);

        applyRules(testFiles, rules, sizes, fileio, parser, serializer, true, true);
      
        setTimeout(function() {
        let document;
        let pageNode;
        let pageId;
        let pageOptions;
        let linkOptions;

        // Expect 3 UIM to be update
        expect(results.length).toEqual(6);

        // FIRST UIM
        document = parser.parseFromString(results[0]);
        pageNode = document.documentElement;
        pageId = pageNode.getAttribute("PAGE_ID");
        // check page ID
        expect(pageId).toEqual("AllAllowed_SourceConnectionsWithVims");
        pageOptions = getPageOptions(pageNode);
        // check page width is updated as expected
        expect(pageOptions.width).toEqual("700");
        linkOptions = getLinkOptions(pageNode);
        // check links are expected
        expect(linkOptions).toEqual([]);

        document = parser.parseFromString(results[1]);
        pageNode = document.documentElement;
        pageId = pageNode.getAttribute("PAGE_ID");
        // NO Page ID becuase it is a VIM
        expect(pageId).toEqual("");
        pageOptions = getPageOptions(pageNode);
        // check page width is updated as expected
        //expect(pageOptions.width).toEqual("");
        linkOptions = getLinkOptions(pageNode);
        // check links are expected
        expect(linkOptions.length).toEqual(1);
        // check firts link
        let link1 = linkOptions[0];
        expect(link1.pageId).toEqual("AllAllowed_TwoSourceConnections_FromLink");
        expect(link1.options.width).toEqual("700");

        // SECOND UIM
        document = parser.parseFromString(results[2]);
        pageNode = document.documentElement;
        pageId = pageNode.getAttribute("PAGE_ID");
        // check page ID
        expect(pageId).toEqual("AllAllowed_TwoSourceConnections");
        pageOptions = getPageOptions(pageNode);
        // check page width is updated as expected
        expect(pageOptions.width).toEqual("700");
        linkOptions = getLinkOptions(pageNode);
        // check links are expected
        expect(linkOptions).toEqual([]);
        
        // VIM FILE
        document = parser.parseFromString(results[3]);
        pageNode = document.documentElement;
        pageId = pageNode.getAttribute("PAGE_ID");
        // NO Page ID becuase it is a VIM
        expect(pageId).toEqual("");
        pageOptions = getPageOptions(pageNode);
        // check page width is updated as expected
        //expect(pageOptions.width).toEqual("");
        linkOptions = getLinkOptions(pageNode);
        // check links are expected
        expect(linkOptions.length).toEqual(1);
        // check firts link
        link1 = linkOptions[0];
        expect(link1.pageId).toEqual("AllAllowed_TwoSourceConnections_FromLink");
        expect(link1.options.width).toEqual("700");
        

        // THIRD UIM
        document = parser.parseFromString(results[4]);
        pageNode = document.documentElement;
        pageId = pageNode.getAttribute("PAGE_ID");
        // check page ID
        expect(pageId).toEqual("Link_AllAllowed_TwoSourceConnections");
        pageOptions = getPageOptions(pageNode);
        // check page width is updated as expected
        expect(pageOptions.width).toEqual("700");
        linkOptions = getLinkOptions(pageNode);
        // check links are expected
        expect(linkOptions.length).toEqual(4);
        // check firts link
        link1 = linkOptions[0];
        expect(link1.pageId).toEqual("Participant_searchPersonAndProspectPerson");
        expect(link1.options.width).toEqual("700");
        let link2 = linkOptions[1];
        expect(link2.pageId).toEqual("AllAllowed_TwoSourceConnections_FromLink");
        expect(link2.options.width).toEqual("700");
        let link3 = linkOptions[2];
        expect(link3.pageId).toEqual("AllAllowed_TwoSourceConnections_FromLink_1");
        expect(link3.options.width).toEqual("1200");
        let link4 = linkOptions[3];
        expect(link4.pageId).toEqual("Participant_mergeWizardForViewDuplicate");
        expect(link4.options.width).toEqual("1200");

        // FOURTH UIM
        document = parser.parseFromString(results[5]);
        pageNode = document.documentElement;
        pageId = pageNode.getAttribute("PAGE_ID");
        // check page ID
        expect(pageId).toEqual("Link_AllAllowed_TwoSourceConnections");
        pageOptions = getPageOptions(pageNode);
        // check page width is updated as expected
        expect(pageOptions.width).toEqual("700");
        linkOptions = getLinkOptions(pageNode);
        // check links are expected
        expect(linkOptions.length).toEqual(4);
        // check firts link
        link1 = linkOptions[0];
        expect(link1.pageId).toEqual("Participant_searchPersonAndProspectPerson");
        expect(link1.options.width).toEqual("700");
        link2 = linkOptions[1];
        expect(link2.pageId).toEqual("AllAllowed_TwoSourceConnections_FromLink");
        expect(link2.options.width).toEqual("700");
        link3 = linkOptions[2];
        expect(link3.pageId).toEqual("AllAllowed_TwoSourceConnections_FromLink_1");
        expect(link3.options.width).toEqual("700");
        link4 = linkOptions[3];
        expect(link4.pageId).toEqual("Participant_mergeWizardForViewDuplicate");
        expect(link4.options.width).toEqual("1200");

        done();  
        }, 100);    
  });

  test("apply Rules, containsAllowedDomainsOnly enabled for rule",  done => {

    rules = [
      {
        width: "> 768",
        anyTerms: ["criteria.1"],
        allTerms: ["criteria.3"],
        target: "md",
        containsAllowedDomainsOnly: true
      },
    ];
    const testFiles2 = [];
    testFiles2.push(getTestFile("NoneAllowed_OneSourceConnection.uim"));

    let results = [];
    const mockSerializeToString = function(document) {
    const serializedDoc = realSerializer.serializeToString(document);
      results.push(serializedDoc);
    };
      const serializer = {
        serializeToString: mockSerializeToString,
      };

     applyRules(testFiles2, rules, sizes, fileio, parser, serializer, true, true);
   
     setTimeout(function() {

     // Expect 0 UIM to be update i.e no further updates made
     expect(results.length).toEqual(0);
     
     done();  
     }, 100);    
});

test("apply Rules, containsAllowedDomainsOnly enabled for rule",  done => {

  rules = [
    {
      width: "> 768",
      anyTerms: ["criteria.1"],
      allTerms: ["criteria.3"],
      target: "md",
      containsAllowedDomainsOnly: false
    },
  ];
  const testFiles2 = [];
  testFiles2.push(getTestFile("NoneAllowed_OneSourceConnection.uim"));

  let results = [];
  const mockSerializeToString = function(document) {
  const serializedDoc = realSerializer.serializeToString(document);
    results.push(serializedDoc);
  };
    const serializer = {
      serializeToString: mockSerializeToString,
    };

   applyRules(testFiles2, rules, sizes, fileio, parser, serializer, true, true);
 
   setTimeout(function() {

   // Expect 0 UIM to be update i.e no further updates made
   expect(results.length).toEqual(1);
   
   done();  
   }, 120);    
});
});
