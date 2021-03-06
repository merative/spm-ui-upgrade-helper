const { dummyShellJs } = require("../shared-utils/sharedUtils").dummyShells;
const gatsbyConditionalDeploy = require("./gatsby-conditional-deploy");

const consoleInfoBackup = console.info;

beforeEach(() => {
  console.info = () => {};
});

afterEach(() => {
  dummyShellJs._clear();
  console.info = consoleInfoBackup;
});

test('it deploys if there are changes to the "packages/gatsby-docs" folder', () => {
  const changes = [
    "foo/foo.txt",
    "packages/gatsby-docs/should-cause-deploy.txt",
    "bar/bar.txt",
  ];
  const expected = [ "yarn gatsby:deploy" ];

  gatsbyConditionalDeploy(dummyShellJs, changes);

  expect(expected).toEqual(dummyShellJs.execList);
  expect(expected.length).toEqual(dummyShellJs.execList.length);
});

test('it does not deploy if there are no changes', () => {
  const changes = [
    "not-gatsby-docs-folder/foo.txt",
  ]
  const expected = [];

  gatsbyConditionalDeploy(dummyShellJs, changes);

  expect(expected).toEqual(dummyShellJs.execList);
  expect(expected.length).toEqual(dummyShellJs.execList.length);
});
