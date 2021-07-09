const dryRunShellJs = {
  exit: () => {},
  echo: arg => console.log(arg),
  cp: (arg1, arg2) => {
    console.log(`cp ${arg1} ${arg2}`);
    return { code: 0 };
  },
  exec: arg => {
    console.log(arg);
    return { code: 0 };
  },
}

module.exports = dryRunShellJs;
