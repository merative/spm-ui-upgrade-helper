const fileio = require('@folkforms/file-io');

const removeIgnoredFiles = (config, inputFiles) => {
  const ignoreFiles = [
    fileio.glob(`${config.ignorePatternsFolder}/*.json`),
    fileio.glob(`${config.ignorePatternsFolderAdditional}/*.json`),
  ].flat();

  ignoreFiles.forEach(filename => {
    const ignoreJson = fileio.readJson(filename);
    // Ignore globs
    if(ignoreJson.globs && ignoreJson.globs.length > 0) {
      ignoreJson.globs.forEach(pattern => {
        const glob = `${config.inputFolder}/${pattern}`;
        const foundFiles = fileio.glob(glob);
        foundFiles.forEach(foundFile => {
          let index = inputFiles.indexOf(foundFile);
          if(index !== -1) {
            console.log(`### ignoring (via glob '${glob}'): ${inputFiles[index]}`);
            inputFiles.splice(index, 1);
          }
        });
      });
    }
    // Ignore tokens
    for(let i = 0; i < inputFiles.length; i++) {
      if(ignoreJson.tokens && ignoreJson.tokens.length > 0) {
        ignoreJson.tokens.forEach(token => {
          const index = inputFiles[i].indexOf(token);
          if(index != -1) {
            console.log(`### ignoring (via token '${token}'): ${inputFiles[i]}`);
            inputFiles.splice(i, 1);
            i--;
            return;
          }
        });
      }
    }
  });

  return inputFiles;
}

module.exports = { removeIgnoredFiles };
