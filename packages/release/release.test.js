const release = require("./release");

let shelljs;
let execList = [];
let echoList = [];
beforeEach(() => {
  jest.mock("shelljs", () => {
    return {
      exit: jest.fn(),
    }
  })
  shelljs = require("shelljs");
  // Can't access execList/echoList in jest factory above
  shelljs.exec = jest.fn(input => { execList.push(input); return { code: 0, stdout: "" }; });
  shelljs.echo = jest.fn(message => echoList.push(message));
});

afterEach(() => {
  execList = [];
  echoList = [];
  jest.resetModules();
  jest.resetAllMocks();
})

test('--start option runs the correct commands', () => {
  shelljs.exec = jest.fn(input => {
    execList.push(input);
    if(input === "git status --porcelain") {
      return { code: 0, stdout: "" };
    } else if(input === "git symbolic-ref --short -q HEAD") {
      return { code: 0, stdout: "main\n" };
    } else if(input === "git tag --list v0.10.0") {
      return { code: 0, stdout: "" };
    } else {
      return { code: 0 };
    }
  });

  const expected = [
    "git status --porcelain",
    "git symbolic-ref --short -q HEAD",
    "git pull --tags",
    "git tag --list v0.10.0",
    "yarn install-all",
    "yarn test",
    "yarn build:release",
    "npm version 0.10.0",
    "git add package.json && git commit -m \"update package v0.10.0\"",
    "git push origin main",
    "echo { \"version\": \"0.10.0\" }>version.json",
    "yarn changelog",
    "git add CHANGELOG.md && git commit -m \"update changelog v0.10.0\"",
    "git push origin main",
    "git checkout -b refs/heads/v0.10.0:refs/heads/v0.10.0",
    "git push --set-upstream origin v0.10.0",
  ];

  release(shelljs, "--start", "0.10.0");

  expect(execList).toEqual(expected);
  expect(execList.length).toEqual(expected.length);
});

test('--start option can only be run on the main branch', () => {
  shelljs.exec = jest.fn(input => {
    execList.push(input);
    if(input === "git status --porcelain") {
      return { code: 0, stdout: "" };
    } else if(input === "git symbolic-ref --short -q HEAD") {
      return { code: 0, stdout: "not-main\n" };
    } else {
      return { code: 0 };
    }
  });

  const expectedExec = [
    "git status --porcelain",
    "git symbolic-ref --short -q HEAD",
  ];
  const expectedEcho = [
    "Validating...",
    "ERROR: Releases can only be created on 'main' branch.",
  ];

  release(shelljs, "--start", "0.10.0");

  expect(execList).toEqual(expectedExec);
  expect(execList.length).toEqual(expectedExec.length);
  expect(echoList).toEqual(expectedEcho);
  expect(echoList.length).toEqual(expectedEcho.length);
});

test('--ship option runs the correct commands', () => {
  const expected = [
    "docker login",
    "yarn docker-tasks release 0.10.0",
    "yarn docker-tasks release latest",
    "git tag v0.10.0",
    "git push --tags",
    "rm -f version.json",
  ];

  release(shelljs, "--ship", "0.10.0");

  expect(execList).toEqual(expected);
  expect(execList.length).toEqual(expected.length);
});

test('version is validated correctly', () => {
  const expected = [
    "Validating...",
    "ERROR: Version must match x.y.z format.",
  ];

  release(shelljs, "--start", "v0.0.0");

  expect(echoList).toEqual(expected);
  expect(echoList.length).toEqual(expected.length);
  expect(execList).toEqual([]);
  expect(execList.length).toEqual(0);
});

test('re-using an existing tag will fail', () => {
  shelljs.exec = jest.fn(input => {
    execList.push(input);
    if(input === "git status --porcelain") {
      return { code: 0, stdout: "" };
    } else if(input === "git symbolic-ref --short -q HEAD") {
      return { code: 0, stdout: "main\n" };
    } else if(input === "git tag --list v0.10.0") {
      return { code: 0, stdout: "v0.10.0" };
    } else {
      return { code: 0 };
    }
  });

  const expectedEcho = [
    "Validating...",
    "ERROR: Version 0.10.0 already exists (found tag 'v0.10.0').",
  ];
  const expectedExec = [
    "git status --porcelain",
    "git symbolic-ref --short -q HEAD",
    "git pull --tags",
    "git tag --list v0.10.0"
  ];

  release(shelljs, "--start", "0.10.0");

  expect(echoList).toEqual(expectedEcho);
  expect(echoList.length).toEqual(expectedEcho.length);
  expect(execList).toEqual(expectedExec);
  expect(execList.length).toEqual(expectedExec.length);
});

test('using an unknown option will fail', () => {
  const expected = [
    "ERROR: Unknown option: '--foo'",
  ];

  release(shelljs, "--foo", "0.10.0");

  expect(echoList).toEqual(expected);
  expect(echoList.length).toEqual(expected.length);
  expect(execList).toEqual([]);
  expect(execList.length).toEqual(0);
});
