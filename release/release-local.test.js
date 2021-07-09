const dummyShell = require("./tests/dummyShellJs");
const release = require("./release-local");

afterEach(() => {
  dummyShell._clear();
});

test('test that --start option runs the correct commands', () => {
  const expected = [
    "git checkout -b v0.10.0",
    "git push --set-upstream origin v0.10.0",
    "yarn install",
    "yarn generate-files",
    "yarn docker-tasks build",
  ];

  release(dummyShell, "--start", "0.10.0");

  expect(expected).toEqual(dummyShell.execList);
  expect(expected.length).toEqual(dummyShell.execList.length);
});

test('test that --ship option runs the correct commands', () => {
  const expected = [
    "docker login wh-govspm-docker-local.artifactory.swg-devops.com",
    "yarn docker-tasks release 0.10.0",
    "git tag v0.10.0",
    "git push --tags",
  ];

  release(dummyShell, "--ship", "0.10.0");

  expect(expected).toEqual(dummyShell.execList);
  expect(expected.length).toEqual(dummyShell.execList.length);
});

test('test that version is validated correctly', () => {
  const expected = [
    "Option: '--start', Version: 'v0.0.0'",
    "ERROR: Version must match x.y.z format.",
  ];

  release(dummyShell, "--start", "v0.0.0");

  expect(expected).toEqual(dummyShell.echoList);
  expect(expected.length).toEqual(dummyShell.echoList.length);

  expect([]).toEqual(dummyShell.execList);
  expect(0).toEqual(dummyShell.execList.length);
});

test('test that an unknown option will fail', () => {
  const expected = [
    "Option: '--foo', Version: '0.10.0'",
    "ERROR: Unknown option: '--foo'",
  ];

  release(dummyShell, "--foo", "0.10.0");

  expect(expected).toEqual(dummyShell.echoList);
  expect(expected.length).toEqual(dummyShell.echoList.length);

  expect([]).toEqual(dummyShell.execList);
  expect(0).toEqual(dummyShell.execList.length);
});