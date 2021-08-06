const failingShellJs = {
  _clear: () => {
    failingShellJs.echoList = [];
    failingShellJs.cpList = [];
    failingShellJs.execList = [];
  },
  exit: code => {
    return { code };
  },
  echoList: [],
  echo: arg => {
    failingShellJs.echoList.push(arg.trim());
  },
  cp: (arg1, arg2) => {
    failingShellJs.execList.push(`cp ${arg1} ${arg2}`);
    return { code: 1 };
  },
  execList: [],
  exec: (...args) => {
    failingShellJs.execList.push(args.join(" ").trim());
    return { code: 1 };
  },
}

module.exports = failingShellJs;
