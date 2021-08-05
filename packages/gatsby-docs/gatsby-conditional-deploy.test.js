const { dummyShellJs } = require("dummy-shells");
const gatsbyConditionalDeploy = require("./gatsby-conditional-deploy");

const consoleInfoBackup = console.info;

beforeEach(() => {
  console.info = () => {};
});

afterEach(() => {
  dummyShellJs._clear();
  console.info = consoleInfoBackup;
});

test('it deploys if there are changes to the "docs" folder', () => {
  const changes = [
    "foo/foo.txt",
    "docs/should-cause-deploy.txt",
    "bar/bar.txt",
  ];
  const expected = [ "yarn gatsby:deploy" ];

  gatsbyConditionalDeploy(dummyShellJs, changes);

  expect(expected).toEqual(dummyShellJs.execList);
  expect(expected.length).toEqual(dummyShellJs.execList.length);
});

test('it deploys if there are changes to nav-items.yaml', () => {
  const changes = [
    "foo/foo.txt",
    "foo/nav-items.yaml",
    "bar/bar.txt",
  ];
  const expected = [ "yarn gatsby:deploy" ];

  gatsbyConditionalDeploy(dummyShellJs, changes);

  expect(expected).toEqual(dummyShellJs.execList);
  expect(expected.length).toEqual(dummyShellJs.execList.length);
});

test('it does NOT deploy if there are no changes', () => {
  const changes = [
    "not-docs-folder/foo.txt",
  ]
  const expected = [];

  gatsbyConditionalDeploy(dummyShellJs, changes);

  expect(expected).toEqual(dummyShellJs.execList);
  expect(expected.length).toEqual(dummyShellJs.execList.length);
});
