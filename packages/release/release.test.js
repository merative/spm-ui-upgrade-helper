const utils = require("../shared-utils/sharedUtils");
const { dummyShellJs } = utils.dummyShells;
const release = require("./release");

beforeEach(() => {
  dummyShellJs._setExecStdOut("");
});

afterEach(() => {
  dummyShellJs._clear();
});

test('test that --start option runs the correct commands', () => {
  const expected = [
    "git status --porcelain",
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

  expect(dummyShellJs.execList).toEqual(expected);
  expect(dummyShellJs.execList.length).toEqual(expected.length);
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

  expect(dummyShellJs.execList).toEqual(expected);
  expect(dummyShellJs.execList.length).toEqual(expected.length);
});

test('test that version is validated correctly', () => {
  const expected = [
    "Validating...",
    "ERROR: Version must match x.y.z format.",
  ];

  release(dummyShellJs, "--start", "v0.0.0");

  expect(dummyShellJs.echoList).toEqual(expected);
  expect(dummyShellJs.echoList.length).toEqual(expected.length);

  expect(dummyShellJs.execList).toEqual([]);
  expect(dummyShellJs.execList.length).toEqual(0);
});

test('test that an unknown option will fail', () => {
  const expected = [
    "ERROR: Unknown option: '--foo'",
  ];

  release(dummyShellJs, "--foo", "0.10.0");

  expect(dummyShellJs.echoList).toEqual(expected);
  expect(dummyShellJs.echoList.length).toEqual(expected.length);

  expect(dummyShellJs.execList).toEqual([]);
  expect(dummyShellJs.execList.length).toEqual(0);
});

test('test that re-using an existing tag will fail', () => {
  dummyShellJs._setExecStdOut("0.10.0");
  const expected = [
    "Validating...",
    "ERROR: Version 0.10.0 already exists (found tag 'v0.10.0').",
  ];

  release(dummyShellJs, "--start", "0.10.0", { testMode: true });

  expect(dummyShellJs.echoList).toEqual(expected);
  expect(dummyShellJs.echoList.length).toEqual(expected.length);

  expect(dummyShellJs.execList).toEqual([ "git pull --tags", "git tag --list v0.10.0" ]);
  expect(dummyShellJs.execList.length).toEqual(2);
});
