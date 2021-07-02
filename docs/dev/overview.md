[<<< Back to the developer guide](../developer_guide.md)

# Overview

- Eclipse Theia is our front-end. It is an IDE inside the browser.
- We have added plugins to Eclipse Theia that appear as new `F1` shortcuts (the same as `F1` in VSCode)
- These plugins call Rest APIs that do the actual work

## Docker

- The tool is run as a Docker container
- `run.bat`/`run.sh` will map local folders to the Docker container thus allowing it access to the customer code

## CSS Rules Engine

- Located in `packages/css-rules-engine`
- Running this tool does the following:
  1. Creates an empty git repo in the output folder
  2. Adds the customer CSS
  3. Iterates over all the customer CSS files
  4. Any files that need functional modifications will be prettified first
  5. The prettified files are committed
  6. The functional modifications are then applied and placed in the git repo (but not committed)
  7. The git repo in Eclipse Theia will now show the functional changes
