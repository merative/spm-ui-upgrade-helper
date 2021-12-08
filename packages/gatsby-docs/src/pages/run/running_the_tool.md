---
title: Running the tool
---

1. Start the tool:
    - `spm-ui-upgrade-helper.bat <version> <input folder> <output folder>` (Windows)
    - `./spm-ui-upgrade-helper.sh <version> <input folder> <output folder>` (Linux)
    - Notes:
        - `<version>` is typically "latest".
        - `<input folder>` should be the root of your 7.0.11.0 development environment.
        - Run `chmod -R 777 <output folder>` so that Docker can interact with the output folder.
        - `<output folder>` should be a temporary folder e.g. `c:\temp\upgrade` or `/tmp/upgrade`.
        - `<output folder>` will be wiped, so be careful!
        - The input and output folders MUST be absolute paths.
2. Open your browser to http://localhost:3000
3. Press `F1` or `cmd + shift + p`.
4. Type "Run SPM UI Upgrade Helper" and click on the shortcut.
5. Wait a few minutes for the tool to finish.
8. The files in `<input folder>` will be scanned and the results placed in `<output folder>`.
7.  Click the `Source Control: Git` button on the left sidebar to inspect the changes.

![1. Press F1, 2. Type "Run SPM UI Upgrade Helper", 3. Select the shortcut, 4. Wait for the tool to finish, 5. Click "Source Control: Git" to see the output](../../images/upgrade-helper.gif "Running the UI Upgrade Helper tool")

8. Copy the contents of `<output folder>` into your v8 development environment.
9. Build and test v8.

## Errors

Docker container logs should be visible in the console, or via `docker logs spm-ui-upgrade-helper`.

You can save the logs to a file using e.g. `docker logs spm-ui-upgrade-helper > /tmp/logs.txt`.

## Troubleshooting

- Make sure you are logged in to Docker (run `docker login`.)
- Make sure folders are shared in Docker Desktop.
- Restart Docker Desktop.
- Delete `<output folder>` and try again.
- Make sure you have run `chmod -R 777 <output folder>` so that Docker can write to it.
- Don't refresh http://localhost:3000/#/home/workspace/output, instead go to http://localhost:3000.
- To kill the Docker container use `docker stop spm-ui-upgrade-helper` followed by `docker rm spm-ui-upgrade-helper`.
