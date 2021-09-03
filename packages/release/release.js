const release = (shell, option, version) => {
  if(option === "--start") {
    shell.echo("Validating...");
    // Make sure version number is correct format
    if(!version.match(/^\d+\.\d+\.\d+$/)) {
      shell.echo("ERROR: Version must match x.y.z format.");
      return 1;
    }
    // Make sure working directory is clean
    const r = exec(shell, `git status --porcelain`);
    if(r.stdout && r.stdout.length > 0) {
      shell.echo("ERROR: Working directory is not clean.");
      return 1;
    }
    // Make sure we are on "main" branch
    let branch = exec(shell, `git symbolic-ref --short -q HEAD`).stdout;
    branch = branch.substring(0, branch.length - 1);
    if(branch !== "main") {
      shell.echo(`ERROR: Releases can only be created on 'main' branch.`);
      return 1;
    }
    // Make sure tag does not already exist
    exec(shell, `git pull --tags`);
    const existing = exec(shell, `git tag --list v${version}`).stdout;
    if(existing.length > 0) {
      shell.echo(`ERROR: Version ${version} already exists (found tag 'v${version}').`);
      return 1;
    }
    shell.echo("Building...");
    exec(shell, `yarn install-all`);
    exec(shell, `yarn test`);
    exec(shell, `yarn build:release`);
    shell.echo("Creating release branch...");
    exec(shell, `npm version ${version}`);
    exec(shell, `git add package.json && git commit -m "update package v${version}"`);
    exec(shell, `echo { "version": "${version}" }>version.json`);
    // creating changelog
    exec(shell, "yarn changelog");
    exec(shell, `git add CHANGELOG.md && git commit -m "update changelog v${version}"`);
    exec(shell, `git push origin main`);
    // create release branch
    exec(shell, `git checkout -b refs/heads/v${version}:refs/heads/v${version}`);
    exec(shell, `git push --set-upstream origin v${version}`);
    shell.echo("");
    shell.echo("Build successful!");
    shell.echo("");
    shell.echo(
      "You should now perform acceptance testing. Use `yarn at:install && yarn at:generate-data kitchen-sink` " +
      "and then `acceptance-test.bat`/`acceptance-test.sh` and test against the generated acceptance test data."
    );
    shell.echo("");
    shell.echo(`Once acceptance testing is finished, use \`yarn release --ship\` to release.`);
    shell.echo("");
    return 0;
  }

  if(option === "--ship") {
    shell.echo("Shipping...");
    exec(shell, "docker login");
    exec(shell, `yarn docker-tasks release ${version}`);
    exec(shell, `yarn docker-tasks release latest`);
    exec(shell, `git tag v${version}`);
    exec(shell, `git push --tags`);
    exec(shell, `rm -f version.json`);
    return 0;
  }

  shell.echo(`ERROR: Unknown option: '${option}'`);
  return 1;
}

const exec = (shell, cmd) => {
  const r = shell.exec(cmd);
  if(r.code != 0) { shell.exit(r.code); }
  return r;
}

module.exports = release;
