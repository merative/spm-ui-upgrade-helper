const shelljs = require ("shelljs");

const dryRunShellJs = {
  exit: () => {},
  echo: arg => console.log(arg),
  cp: (arg1, arg2) => {
    console.log(`cp ${arg1} ${arg2}`);
    return { code: 0 };
  },
  exec: cmd => {
    console.log(cmd);
    return { code: 0, stdout: dryRunShellJs._getExecStdOut(cmd) };
  },
  _getExecStdOut: cmd => {
    if(cmd === "git status --porcelain" ||
       cmd === "git symbolic-ref --short -q HEAD" ||
       cmd.startsWith("git tag --list v")
    ) {
      return shelljs.exec(cmd).stdout;
    }
    return "";
  },
}

module.exports = dryRunShellJs;
