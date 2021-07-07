const identicalData = (a, b) => {
  return (Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]))
  || typeof a === "string" && typeof b === "string" &&
    a.length === b.length &&
    a === b;
}

module.exports = { identicalData };
