const fileio = require('@folkforms/file-io');

const containsAnyToken = (path, tokens) => {
  for(let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const index = path.indexOf(token);
    if(index != -1) {
      console.log(`## ignoring (via token '${token}'): ${path}`);
      return true;
    }
  }
  return false;
}

const removeIgnoredFiles = (config, inputFiles) => {
  const ignoreFiles = [
    fileio.glob(`${config.ignorePatternsFolder}/*.json`),
    fileio.glob(`${config.ignorePatternsFolderAdditional}/*.json`),
  ].flat();

  ignoreFiles.forEach(filename => {
    const ignoreJson = fileio.readJson(filename);
    // Ignore tokens
    console.log(`#### inputFiles = ${JSON.stringify(inputFiles)}`);
    if(ignoreJson.tokens && ignoreJson.tokens.length > 0) {
      for(let i = 0; i < inputFiles.length; i++) {
        if(containsAnyToken(inputFiles[i], ignoreJson.tokens)) {
          inputFiles.splice(i, 1);
          i--;
        }
      }
    }
    // Ignore globs
    if(ignoreJson.globs && ignoreJson.globs.length > 0) {
      ignoreJson.globs.forEach(pattern => {
        const glob = `${config.inputFolder}/${pattern}`;
        const globbedFiles = fileio.glob(glob);
        globbedFiles.forEach(globbedFile => {
          let index = inputFiles.indexOf(globbedFile);
          if(index !== -1) {
            console.log(`## ignoring (via glob '${glob}'): ${inputFiles[index]}`);
            inputFiles.splice(index, 1);
          }
        });
      });
    }
  });

  return inputFiles;
}

module.exports = { removeIgnoredFiles };
