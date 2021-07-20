const fileio = require('@folkforms/file-io');

const containsAnyToken = (path, tokens) => {
  for(let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const index = path.indexOf(token);
    if(index != -1) {
      return true;
    }
  }
  return false;
}

const removeIgnoredFiles = (config, inputFiles) => {
  let startTime = new Date().getTime();
  const countBeforeIgnore = inputFiles.length;

  const ignoreFiles = [
    fileio.glob(`${config.ignorePatternsFolder}/*.json`),
    fileio.glob(`${config.ignorePatternsFolderAdditional}/*.json`),
  ].flat();

  ignoreFiles.forEach(filename => {
    const ignoreJson = fileio.readJson(filename);
    // Ignore tokens
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
            inputFiles.splice(index, 1);
          }
        });
      });
    }
  });
  const countAfterIgnore = inputFiles.length;
  let endTime = new Date().getTime();
  console.info(`Ignored ${countBeforeIgnore - countAfterIgnore} files [${endTime - startTime} ms]`);

  return inputFiles;
}

module.exports = { removeIgnoredFiles };
