const gatsbyConditionalDeploy = (shell, changes) => {

  let hasChanges = false;
  changes.forEach(line => {
    if(line.startsWith("docs/")|| line.indexOf("nav-items.yaml") != -1) {
      hasChanges = true;
    }
  });

  if(hasChanges) {
    return shell.exec("yarn gatsby:deploy").code;
  } else {
    shell.echo("Not running gatsby:deploy as there were no changes to the 'docs' folder or to 'nav-items.yaml'.");
    return 0;
  }
}

module.exports = gatsbyConditionalDeploy;
