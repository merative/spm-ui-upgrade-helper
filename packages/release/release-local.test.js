const { dummyShellJs } = require("../shared-utils/sharedUtils").dummyShells;
const release = require("./release-local");

beforeEach(() => {
  dummyShellJs._setExecStdOut("");
});

afterEach(() => {
  dummyShellJs._clear();
});

test('test that --start option runs the correct commands', () => {
  const expected = [
    "git pull --tags",
    "git tag --list v0.10.0",
    "yarn install",
    "yarn test",
    "echo { \"version\": \"0.10.0\" }>version.json",
    "yarn build:release",
    "git checkout -b v0.10.0",
    "git push --set-upstream origin v0.10.0",
  ];

  release(dummyShellJs, "--start", "0.10.0");

  expect(expected).toEqual(dummyShellJs.execList);
  expect(expected.length).toEqual(dummyShellJs.execList.length);
});

test('test that --ship option runs the correct commands', () => {
  const expected = [
    "docker login",
    "yarn docker-tasks release 0.10.0",
    "yarn docker-tasks release latest",
    "git tag v0.10.0",
    "git push --tags",
    "rm -f version.json",
  ];

  release(dummyShellJs, "--ship", "0.10.0");

  expect(expected).toEqual(dummyShellJs.execList);
  expect(expected.length).toEqual(dummyShellJs.execList.length);
});

test('test that version is validated correctly', () => {
  const expected = [
    "Validating...",
    "ERROR: Version must match x.y.z format.",
  ];

  release(dummyShellJs, "--start", "v0.0.0");

  expect(expected).toEqual(dummyShellJs.echoList);
  expect(expected.length).toEqual(dummyShellJs.echoList.length);

  expect([]).toEqual(dummyShellJs.execList);
  expect(0).toEqual(dummyShellJs.execList.length);
});

test('test that an unknown option will fail', () => {
  const expected = [
    "ERROR: Unknown option: '--foo'",
  ];

  release(dummyShellJs, "--foo", "0.10.0");

  expect(expected).toEqual(dummyShellJs.echoList);
  expect(expected.length).toEqual(dummyShellJs.echoList.length);

  expect([]).toEqual(dummyShellJs.execList);
  expect(0).toEqual(dummyShellJs.execList.length);
});

test('test that re-using an existing tag will fail', () => {
  dummyShellJs._setExecStdOut("0.10.0");
  const expected = [
    "Validating...",
    "ERROR: Version 0.10.0 already exists (found tag 'v0.10.0').",
  ];

  release(dummyShellJs, "--start", "0.10.0");

  expect(expected).toEqual(dummyShellJs.echoList);
  expect(expected.length).toEqual(dummyShellJs.echoList.length);

  expect([ "git pull --tags", "git tag --list v0.10.0" ]).toEqual(dummyShellJs.execList);
  expect(2).toEqual(dummyShellJs.execList.length);
});
