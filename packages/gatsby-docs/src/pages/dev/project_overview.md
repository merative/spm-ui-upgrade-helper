---
title: Project overview
---

## Front end

- Eclipse Theia is our front-end. It is an IDE inside the browser.
- We have added plugins to Eclipse Theia that appear as new `F1` shortcuts (the same as `F1` in VSCode.)
- These plugins call Rest APIs that do the actual work.

## Docker

- The tool is run as a Docker container.
- `spm-ui-upgrade-helper.bat`/`spm-ui-upgrade-helper.sh` will map local folders to the Docker container thus allowing it access to the customer code.
- `dev.bat`/`dev.sh` will map code to the Docker container allowing you to edit and test code on the fly.

## Tools

### Main tool

- Located in `packages/main-tool`
- Running this tool does the following:
    - Calls `packages/shared-utils/src/init.js`
        - Creates an empty git repo in the output folder
        - Copies potential target files to the output folder
        - Commits the copied files so that we can use Git to diff them if they change
    - Iterates through `config/tools.json` and activates any tools that have `enabled: true`
    - The "Source Control: Git" tab in Eclipse Theia shows the diff of the changes

### CSS rules tool

- Iterates over customer CSS files and applies the rules codified in `packages/css-rules-tool/rules/*.json`.

### Icon replacer tool

- Loads icon replacement mappings from `packages/icon-replacer-tool/icon-mappings.json`.
- Iterates over customer files and replaces any references to old icons with new icons.
- Replaces any old icon files it finds with the new version of the icon.
