const fs = require("fs-extra");
const yaml = require("js-yaml");
const { dummyShellJs, failingShellJs } = require("../shared-utils/sharedUtils").dummyShells;
const dockerTasks = require("./docker-tasks");

let props;
try {
  const file = fs.readFileSync("./.docker-tasks-test-config.yml", "utf8");
  props = yaml.load(file);
} catch (e) {
  console.error("ERROR: Could not read file ./tests/.docker-tasks-test-config.yml.");
  throw e;
}

beforeEach(() => {
  dummyShellJs._clear();
});

test("calling 'debug' executes the correct commands", () => {
  const exitCode = dockerTasks(dummyShellJs, props, ["debug"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.echoList).toContain("docker exec --tty --interactive foo bash");
  expect(dummyShellJs.echoList).toContain("docker run  --tty --interactive --entrypoint bash foo:latest");
});

test("passing an unknown command returns an error message and a non-zero exit code", () => {
  const exitCode = dockerTasks(dummyShellJs, props, ["foo"]);
  expect(exitCode).toEqual(1);
  expect(dummyShellJs.echoList).toContain("ERROR: Unknown option 'foo'.");
});

test("passing no command returns an error message and a non-zero exit code", () => {
  const exitCode = dockerTasks(dummyShellJs, props, []);
  expect(exitCode).toEqual(1);
  expect(dummyShellJs.echoList).toContain("ERROR: No option chosen.");
});

test("validating required properties for 'build' command", () => {
  let invalidProps = {};
  const exitCode = dockerTasks(dummyShellJs, invalidProps, ["build"]);
  expect(exitCode).toEqual(1);
  expect(dummyShellJs.echoList).toContain(
    "ERROR: Missing configuration properties: imageName"
  );
});

test("validating required properties for build/run/clear/debug commands", () => {
  const required = {
    build: ["imageName"],
    run: ["imageName"],
    clear: ["imageName"],
    debug: ["imageName"],
  };
  let invalidProps = {};

  Object.keys(required).forEach((cmd) => {
    const exitCode = dockerTasks(dummyShellJs, invalidProps, [cmd]);
    expect(exitCode).toEqual(1);
    expect(dummyShellJs.echoList).toContain(
      `ERROR: Missing configuration properties: ${required[cmd].join(", ")}`
    );
  });
});

test("validating required properties for 'release <version>' command", () => {
  let invalidProps = {};
  const exitCode = dockerTasks(dummyShellJs, invalidProps, [
    "release",
    "version",
  ]);
  expect(exitCode).toEqual(1);
  expect(dummyShellJs.echoList).toContain(
    "ERROR: Missing configuration properties: imageName, username"
  );
});

test("validating required properties for 'release latest' command", () => {
  let invalidProps = {};
  const exitCode = dockerTasks(dummyShellJs, invalidProps, [
    "release",
    "latest",
  ]);
  expect(exitCode).toEqual(1);
  expect(dummyShellJs.echoList).toContain(
    "ERROR: Missing configuration properties: imageName, username"
  );
});

test("when 'build' fails it returns 1", () => {
  const exitCode = dockerTasks(failingShellJs, props, ["build"]);
  expect(exitCode).toEqual(1);
});

test("calling 'build' runs the correct commands", () => {
  // Arrange
  const inputConfig = [ "imageName: bar" ];
  const props = yaml.load(inputConfig.join("\n"));
  const inputArgs = "build".split(" ");
  const expectedCommands = [
    "docker-compose down --rmi all", "docker-compose build"
  ];
  const expectedEchos = [];
  const expectedErrorCode = 0;

  // Act
  const exitCode = dockerTasks(dummyShellJs, props, inputArgs);

  // Assert
  expect(exitCode).toEqual(expectedErrorCode);
  expectedCommands.forEach(cmd => { expect(dummyShellJs.execList).toContain(cmd); });
  expect(dummyShellJs.execList.length).toEqual(expectedCommands.length);
  expectedEchos.forEach(cmd => { expect(dummyShellJs.echoList).toContain(cmd); });
  expect(dummyShellJs.echoList.length).toEqual(expectedEchos.length);
});

test("calling 'build -p' runs the correct commands", () => {
  // Arrange
  const inputConfig = [ "imageName: foo" ];
  const props = yaml.load(inputConfig.join("\n"));
  const inputArgs = "build -p".split(" ");
  const expectedCommands = ["docker system prune --force", "docker-compose down --rmi all", "docker-compose build"];
  const expectedEchos = [];
  const expectedErrorCode = 0;

  // Act
  const exitCode = dockerTasks(dummyShellJs, props, inputArgs);

  // Assert
  expect(exitCode).toEqual(expectedErrorCode);
  expectedCommands.forEach(cmd => { expect(dummyShellJs.execList).toContain(cmd); });
  expect(dummyShellJs.execList.length).toEqual(expectedCommands.length);
  expectedEchos.forEach(cmd => { expect(dummyShellJs.echoList).toContain(cmd); });
  expect(dummyShellJs.echoList.length).toEqual(expectedEchos.length);
});

test("calling 'clear' runs the correct commands", () => {
  // Arrange
  const inputConfig = [ "imageName: bar" ];
  const props = yaml.load(inputConfig.join("\n"));
  const inputArgs = "clear".split(" ");
  const expectedCommands = [
    "docker-compose stop bar","docker-compose down"
  ];
  const expectedEchos = [];
  const expectedErrorCode = 0;

  // Act
  const exitCode = dockerTasks(dummyShellJs, props, inputArgs);

  // Assert
  expect(exitCode).toEqual(expectedErrorCode);
  expectedCommands.forEach(cmd => { expect(dummyShellJs.execList).toContain(cmd); });
  expect(dummyShellJs.execList.length).toEqual(expectedCommands.length);
  expectedEchos.forEach(cmd => { expect(dummyShellJs.echoList).toContain(cmd); });
  expect(dummyShellJs.echoList.length).toEqual(expectedEchos.length);
});

test("calling 'prune' executes the correct commands", () => {
  // Arrange
  const inputConfig = [];
  const props = yaml.load(inputConfig.join("\n"));
  const inputArgs = "prune".split(" ");
  const expectedCommands = [
    "docker system prune --force"
  ];
  const expectedEchos = [];
  const expectedErrorCode = 0;

  // Act
  const exitCode = dockerTasks(dummyShellJs, props, inputArgs);

  // Assert
  expect(exitCode).toEqual(expectedErrorCode);
  expectedCommands.forEach(cmd => { expect(dummyShellJs.execList).toContain(cmd); });
  expect(dummyShellJs.execList.length).toEqual(expectedCommands.length);
  expectedEchos.forEach(cmd => { expect(dummyShellJs.echoList).toContain(cmd); });
  expect(dummyShellJs.echoList.length).toEqual(expectedEchos.length);
});

test("calling 'release latest' runs the correct commands", () => {
  // Arrange
  const inputConfig = [
    "imageName: foo",
    "parserImageName: bar",
    "nodeImageName: baz",
    "username: folkforms"
  ];
  const props = yaml.load(inputConfig.join("\n"));
  const inputArgs = "release latest".split(" ");
  const expectedCommands = [
    "docker image tag foo:latest docker.io/folkforms/foo:latest",
    "docker image tag bar:latest docker.io/folkforms/bar:latest",
    "docker image tag baz:latest docker.io/folkforms/baz:latest",
    "docker image push docker.io/folkforms/foo:latest",
    "docker image push docker.io/folkforms/bar:latest",
    "docker image push docker.io/folkforms/baz:latest"
  ];
  const expectedEchos = [];
  const expectedErrorCode = 0;

  // Act
  const exitCode = dockerTasks(dummyShellJs, props, inputArgs);

  // Assert
  expect(exitCode).toEqual(expectedErrorCode);
  expectedCommands.forEach(cmd => { expect(dummyShellJs.execList).toContain(cmd); });
  expect(dummyShellJs.execList.length).toEqual(expectedCommands.length);
  expectedEchos.forEach(cmd => { expect(dummyShellJs.echoList).toContain(cmd); });
  expect(dummyShellJs.echoList.length).toEqual(expectedEchos.length);
});

test("calling 'release <version>' runs the correct commands", () => {
  // Arrange
  const inputConfig = [
    "imageName: foo",
    "parserImageName: bar",
    "nodeImageName: baz",
    "username: folkforms"
  ];
  const props = yaml.load(inputConfig.join("\n"));
  const inputArgs = "release 0.0.1".split(" ");
  const expectedCommands = ["docker image tag foo:latest foo:0.0.1", "docker image tag bar:latest bar:0.0.1", "docker image tag baz:latest baz:0.0.1", "docker image tag foo:latest docker.io/folkforms/foo:0.0.1", "docker image tag bar:latest docker.io/folkforms/bar:0.0.1", "docker image tag baz:latest docker.io/folkforms/baz:0.0.1", "docker image push docker.io/folkforms/foo:0.0.1", "docker image push docker.io/folkforms/bar:0.0.1", "docker image push docker.io/folkforms/baz:0.0.1"];
  const expectedEchos = [];
  const expectedErrorCode = 0;

  // Act
  const exitCode = dockerTasks(dummyShellJs, props, inputArgs);

  // Assert
  expect(exitCode).toEqual(expectedErrorCode);
  expectedCommands.forEach(cmd => { expect(dummyShellJs.execList).toContain(cmd); });
  expect(dummyShellJs.execList.length).toEqual(expectedCommands.length);
  expectedEchos.forEach(cmd => { expect(dummyShellJs.echoList).toContain(cmd); });
  expect(dummyShellJs.echoList.length).toEqual(expectedEchos.length);
});

test("calling 'run' runs the correct commands", () => {
  // Arrange
  const inputConfig = [
    "imageName: bar",
    "runArgs: -p 3000:3000"
  ];
  const props = yaml.load(inputConfig.join("\n"));
  const inputArgs = "run".split(" ");
  const expectedCommands = [
    "docker-compose down", "docker-compose run -p 3000:3000 --name bar bar"
  ];
  const expectedEchos = [];
  const expectedErrorCode = 0;

  // Act
  const exitCode = dockerTasks(dummyShellJs, props, inputArgs);

  // Assert
  expect(exitCode).toEqual(expectedErrorCode);
  expectedCommands.forEach(cmd => { expect(dummyShellJs.execList).toContain(cmd); });
  expect(dummyShellJs.execList.length).toEqual(expectedCommands.length);
  expectedEchos.forEach(cmd => { expect(dummyShellJs.echoList).toContain(cmd); });
  expect(dummyShellJs.echoList.length).toEqual(expectedEchos.length);
});
