const gatsbyConditionalDeploy = (shell, changes) => {

  let hasChanges = false;
  for(let i = 0; i < changes.length; i++) {
    if(changes[i].startsWith("docs/") || changes[i].indexOf("nav-items.yaml") != -1) {
      console.info(`Running gatsby:deploy due to change in ${changes[i]}`);
      hasChanges = true;
      break;
    }
  };

  if(hasChanges) {
    return shell.exec("yarn gatsby:deploy").code;
  } else {
    shell.echo("Not running gatsby:deploy as there were no changes to the 'docs' folder or to 'nav-items.yaml'.");
    return 0;
  }
}

module.exports = gatsbyConditionalDeploy;
