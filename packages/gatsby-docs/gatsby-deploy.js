const gatsbyDeploy = (shell, changes) => {

  let hasChanges = false;
  changes.forEach(line => {
    if(line.indexOf("docs/") != -1 || line.indexOf("nav-items.yaml") != -1) {
      hasChanges = true;
    }
  });

  if(hasChanges) {
    exec(shell, "yarn gatsby:deploy");
  } else {
    shell.echo("Not running gatsby:deploy as there were no changes to docs folder or nav-items.yaml");
  }

  return 0;
}

const exec = (shell, cmd) => {
  const r = shell.exec(cmd);
  if(r.code != 0) { shell.exit(r.code); }
}

module.exports = gatsbyDeploy;
