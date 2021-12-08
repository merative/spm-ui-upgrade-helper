---
title: Setting up
---

## Initial setup

1. Set up a 7.0.11.0 development environment.
2. Set up a 8.0.0 or later development environment.
3. Install Docker Desktop for [Windows](https://docs.docker.com/docker-for-windows/install/) or [Mac](https://docs.docker.com/docker-for-mac/install/).
4. Install [curl](https://curl.se/download.html).

## Configuring Docker Desktop

After installation, you must configure Docker Desktop to access paths to the folders where the tools work on the local file system. 

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
3. For Linux, make the shell script executable with `chmod +x spm-ui-upgrade-helper.sh`


## Ignoring files

In most cases, you can run the tools without modification, assuming a standard Social Program Management installation.

If your installation is non-standard, you might need to ignore certain files and folders, see [ignoring files page](customer_ignores).
