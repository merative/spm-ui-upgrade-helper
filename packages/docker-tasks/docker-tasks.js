const shelljs = require("shelljs");

const dockerTasks = (execFunction = shelljs, props, args) => {
  const printHelpText = () => {
    execFunction.echo("docker-tasks");
    execFunction.echo("");
    execFunction.echo("Usage:");
    execFunction.echo("");
    execFunction.echo("  yarn docker-tasks help                 Prints this help text.");
    execFunction.echo("  yarn docker-tasks build [-p]           Builds the image. Use -p to prune before building.");
    execFunction.echo("  yarn docker-tasks run                  Runs the container.");
    execFunction.echo("  yarn docker-tasks debug                Prints debug commands to access containers.)");
    execFunction.echo("  yarn docker-tasks clear                Stops and removes the container.");
    execFunction.echo("  yarn docker-tasks prune                Removes unused data.");
    execFunction.echo("  yarn docker-tasks release <version>    Tags '<imageName>:latest' as '<imageName>:<version>', then runs \"docker push <imageName>:latest\" followed by \"docker push <imageName>:<version>\".");
    execFunction.echo("");
    execFunction.echo("Use -n/--dry-run to see what commands would be run, without actually running anything.");
    execFunction.echo("");
  };

  // Handle args

  const option = args.splice(0, 1)[0];
  if (!option) {
    execFunction.echo("ERROR: No option chosen.");
    execFunction.echo("");
    printHelpText();
    return 1;
  }

  let version;
  if (option === "release") {
    version = args.splice(0, 1)[0];
  }

  if (option === "help") {
    printHelpText();
    return 0;
  }

  let prune = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-p" || args[i] === "--prune") {
      prune = true;
      args.splice(i, 1);
      i--;
      continue;
    }
  }

  // Grab additional args
  let additionalArgs = [];
  for (let i = 0; i < args.length; i++) {
    additionalArgs.push(args[i]);
  }
  additionalArgs = additionalArgs.join(" ");

  /**
   * Validates that the given configuration properties exist.
   *
   * @param  {...string} propNames properties to validate
   */
  const validate = (...propNames) => {
    let missingProps = [];
    propNames.forEach((propName) => {
      if (!props[propName]) {
        missingProps.push(propName);
      }
    });
    if (missingProps.length > 0) {
      execFunction.echo(`ERROR: Missing configuration properties: ${missingProps.join(", ")}`);
      return 1;
    }
  };

  /**
   * Executes the given command.
   *
   * @param {string} cmd command to execute
   */
  const exec = (cmd) => {
    cmd = cmd.replace(/\s+/g, " ");
    const r = execFunction.exec(cmd);
    if (r.code) {
      execFunction.echo(`ERROR: Could not run command: '${cmd}'.`);
      return 1;
    }
    return 0;
  };

  // Handle commands

  if (option === "build") { 
    const r0 = validate("imageName");
    console.log("r0", r0);
    if (r0) {
      return r0;
    }        
    let r1;
    if (prune) {
      r1 = exec(`docker system prune --force`);
    }
    if (r1) {
      return r1;
    }
    exec(`docker-compose down --rmi all`);
    return exec(`docker-compose build ${additionalArgs} ${props.imageName}`);
  }

  if (option === "prune") {
    return exec(`docker system prune --force ${additionalArgs}`);
  }

  if (option === "run") {
    const r0 = validate("imageName");
    if (r0) {
      return r0;
    }
    exec(`docker-compose down`);
    const runArgs = props.runArgs || "";
    return exec(`docker-compose run ${additionalArgs} ${runArgs} --name ${props.imageName} ${props.imageName}`);
  }

  if (option === "clear") {
    const r0 = validate("imageName");
    if (r0) {
      return r0;
    }
    const r1 = exec(`docker-compose stop ${props.imageName}`);
    if (r1) {
      return r1;
    }
    return exec(`docker-compose down`);
  }

  if (option === "debug") {
    const r0 = validate("imageName");
    if (r0) {
      return r0;
    }
    execFunction.echo("We can't debug directly because we are inside a script. You need to run one of these commands:");
    execFunction.echo("");
    execFunction.echo(`    docker exec --tty --interactive ${props.imageName} bash`);
    execFunction.echo(`    docker run ${additionalArgs} --tty --interactive --entrypoint bash ${props.imageName}:latest`);
    execFunction.echo("");
    execFunction.echo("The first command will run bash in a running container, the second will start a new container.");
    execFunction.echo("");
    return 0;
  }

  if (option === "release") {
    if (!version) {
      execFunction.echo("ERROR: Must include a version when using 'release' option, e.g. \"yarn docker release 1.0.0\".");
      return 1;
    }

    let cmds = [];
    const r0 = validate("imageName", "username");
    if (r0) {
      return r0;
    }
    if (version !== "latest") {
      cmds.push(`docker image tag ${additionalArgs} ${props.imageName}:latest ${props.imageName}:${version}`);
    }
    cmds.push(`docker image tag ${additionalArgs} ${props.imageName}:latest docker.io/${props.username}/${props.imageName}:${version}`);
    cmds.push(`docker image push ${additionalArgs} docker.io/${props.username}/${props.imageName}:${version}`);

    for (let i = 0; i < cmds.length; i++) {
      exec(cmds[i]);
    }
    return 0;
  }

  execFunction.echo(`ERROR: Unknown option '${option}'.`);
  execFunction.echo("");
  printHelpText();
  return 1;
};

module.exports = dockerTasks;