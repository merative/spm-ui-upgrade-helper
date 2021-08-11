---
title: Project overview
---

## Docker

- The tool is run as a Docker container.
- `spm-ui-upgrade-helper.bat`/`spm-ui-upgrade-helper.sh` will map local folders to the Docker container thus allowing it access to the customer code.
- `dev.bat`/`dev.sh` will map code to the Docker container allowing you to edit and test code on the fly.

## Front end

- [Eclipse Theia](https://theia-ide.org/) is our front-end. It is an IDE inside the browser. Located at [localhost:3000](http://localhost:3000)
- The SPM UI Upgrade Helper tool is a plugin to Eclipse Theia that appears as an `F1` shortcut named "Run SPM UI Upgrade Helper".
- This plugin calls a Rest API that does the actual work.

## Back end

### Main tool

- This tool is run by the "Run SPM UI Upgrade Helper" shortcut described above.
- Located in `packages/main-tool`.
- Running this tool does the following:
    - Calls `packages/shared-utils/src/init.js`
        - Wipes the output folder
        - Creates an empty git repo in the output folder
        - Copies the working set of files to the output folder
        - Commits the files so that if they change we can use Git to diff them
    - Iterates through `config/tools.json` and activates any tools that have `enabled: true`
    - The `Source Control: Git` tab in Eclipse Theia will diff the changes

### CSS rules tool

- Located in `packages/css-rules-tool`.
- Iterates over customer CSS files and applies the rules from `packages/css-rules-tool/rules/*.json`.

### Icon replacer tool

- Located in `packages/icon-replacer-tool`.
- Loads icon replacement mappings from `packages/icon-replacer-tool/icon-mappings.json`.
- Iterates over customer files and replaces any references to old icons with new icons.
- Replaces any old icon files it finds with the new version of the icon.
