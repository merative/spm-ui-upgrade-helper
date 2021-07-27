[<< Back to the developer guide](../developer_guide.md)

# Project Overview

## Front End

- Eclipse Theia is our front-end. It is an IDE inside the browser.
- We have added plugins to Eclipse Theia that appear as new `F1` shortcuts (the same as `F1` in VSCode.)
- These plugins call Rest APIs that do the actual work.

## Docker

- The tool is run as a Docker container.
- `spm-ui-upgrade-helper.bat`/`spm-ui-upgrade-helper.sh` will map local folders to the Docker container thus allowing it access to the customer code.
- `dev.bat`/`dev.sh` will map code to the Docker container allowing you to edit and test code on the fly.

## Tools

### Main Tool

- Located in `packages/main-tool`
- Running this tool does the following:
    - Calls `packages/shared-utils/src/init.js`
        - Creates an empty git repo in the output folder
        - Adds the target files
        - Commits the target files
    - Iterates through `config/tools.json` and activates any tools that have `enabled: true`
    - The git repo in Eclipse Theia will now show the functional changes

### CSS Rules Tool

- Iterates over customer CSS files and applies the rules codified in `packages/css-rules-tool/rules/*.json`.

### Icon Replacer Tool

- Loads icon replacement mappings from `packages/icon-replacer-tool/icon-mappings.json`.
- Iterates over customer files and replaces any references to old icons with new icons.
- It will also replace any icon files that it finds.
