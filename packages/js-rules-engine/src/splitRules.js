const filterOut = [ "~", "+", "soria", "div", "body", "modal", "td", "rtl", "input", "a" ];

const splitRules = rule => {
  let tokens = rule.split(/\s/);
  tokens = tokens.map(item => item.split(/\./));
  tokens = tokens.flat();
  tokens = tokens.filter(item => item.length > 0);
  tokens = tokens.filter(item => filterOut.indexOf(item) === -1);
  return tokens.flat();
}

module.exports = { splitRules };
