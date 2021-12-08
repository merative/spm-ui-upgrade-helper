---
title: Setting up
---

## Initial setup

1. Set up a 7.0.11.0 development environment.
2. Set up a 8.0.0 or later development environment.
3. Install Docker Desktop for [Windows](https://docs.docker.com/docker-for-windows/install/) or [Mac](https://docs.docker.com/docker-for-mac/install/).
4. Install [curl](https://curl.se/download.html).

## Docker Desktop configuration

After installation, you must configure Docker Desktop to access paths to the folders where the tools work on the local filesystem. 

- The Social Program Management source code folder that provides the input data. 
- An output folder to write the modified data.

1. Open Docker Desktop.
2. Click Settings > Resources > File Sharing.
3. Share your 7.0.11.0 development environment folder.
4. Share a temporary output folder, e.g. `/tmp/upgrade` or `c:\temp\upgrade`
    - Note that the output folder will be wiped by the SPM UI Upgrade Helper, so be careful! Do NOT point this at your v8 development environment.

![1. Open Docker Desktop, 2. Click the Settings button then Resources then File Sharing, 3. Add the folder you want to share with the Docker container](../../images/docker-volume-sharing.png "Docker volume sharing screenshot")

## Downloading the tool

1. Run `docker login`
2. Download the batch file or shell script:
    - `curl -L https://raw.githubusercontent.com/IBM/spm-ui-upgrade-helper/main/spm-ui-upgrade-helper.bat -o spm-ui-upgrade-helper.bat` (Windows)
    - `curl -L https://raw.githubusercontent.com/IBM/spm-ui-upgrade-helper/main/spm-ui-upgrade-helper.sh -o spm-ui-upgrade-helper.sh` (Linux)
3. If using Linux, make the shell script executable with `chmod +x spm-ui-upgrade-helper.sh`

## Running the tool

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
