const dummyShellJs = {
  _clear: () => {
    dummyShellJs.echoList = [];
    dummyShellJs.cpList = [];
    dummyShellJs.execList = [];
  },
  exit: code => {
    return { code };
  },
  echoList: [],
  echo: arg => {
    dummyShellJs.echoList.push(arg.trim());
  },
  cp: (arg1, arg2) => {
    dummyShellJs.execList.push(`cp ${arg1} ${arg2}`);
    return { code: 0 };
  },
  execList: [],
  exec: (...args) => {
    dummyShellJs.execList.push(args.join(" ").trim());
    return { code: 0 };
  },
}

module.exports = dummyShellJs;
