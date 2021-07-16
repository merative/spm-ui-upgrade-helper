const release = (shell, option, version) => {
  shell.echo(`Option: '${option}', Version: '${version}'`);
  let r;

  if(!version.match(/^\d+\.\d+\.\d+$/)) {
    shell.echo("ERROR: Version must match x.y.z format.");
    return 1;
  }

  if(option === "--start") {
    shell.echo("Building...");
    r = shell.exec(`yarn install`);
    if(r.code != 0) { shell.exit(r.code); }
    r = shell.exec(`echo { "version": "${version}" }>version.json`);
    if(r.code != 0) { shell.exit(r.code); }
    r = shell.exec(`yarn build:release`);
    if(r.code != 0) { shell.exit(r.code); }
    shell.echo("Creating release branch...");
    r = shell.exec(`git checkout -b v${version}`);
    if(r.code != 0) { shell.exit(r.code); }
    r = shell.exec(`git push --set-upstream origin v${version}`);
    if(r.code != 0) { shell.exit(r.code); }
    shell.echo("");
    shell.echo("Build successful. You should now perform acceptance testing. Use `yarn at:build` and `at.bat`/`at.sh` to test against generated acceptance test data.");
    shell.echo("");
    shell.echo(`Once acceptance testing is finished, use \`yarn release --ship ${version}\` to release.`);
    return 0;
  }

  if(option === "--ship") {
    shell.echo("Shipping...");
    r = shell.exec("docker login wh-govspm-docker-local.artifactory.swg-devops.com");
    if(r.code != 0) { shell.exit(r.code); }
    r = shell.exec(`yarn docker-tasks release ${version}`);
    if(r.code != 0) { shell.exit(r.code); }
    r = shell.exec(`yarn docker-tasks release latest`);
    if(r.code != 0) { shell.exit(r.code); }
    r = shell.exec(`yarn docker-tasks release ${version} --public`);
    if(r.code != 0) { shell.exit(r.code); }
    r = shell.exec(`yarn docker-tasks release latest --public`);
    if(r.code != 0) { shell.exit(r.code); }
    r = shell.exec(`git tag v${version}`);
    if(r.code != 0) { shell.exit(r.code); }
    r = shell.exec(`git push --tags`);
    if(r.code != 0) { shell.exit(r.code); }
    r = shell.exec(`rm -f version.json`);
    if(r.code != 0) { shell.exit(r.code); }
    return 0;
  }

  shell.echo(`ERROR: Unknown option: '${option}'`);
  return 1;
}

module.exports = release;
