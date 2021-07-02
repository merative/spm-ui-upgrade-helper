[<<< Back to home](../README.md)

# Customer guide

## Initial setup

1. Install Docker Desktop for [Windows](https://docs.docker.com/docker-for-windows/install/) or [Mac](https://docs.docker.com/docker-for-mac/install/)

Once installed, you will need to allow Docker Desktop to access certain paths on the local filesystem. These will be the folders that the tool will work on i.e. your SPM source code folder that will provide the input data, plus an output folder where it will write the modified data.

2. Open Docker Desktop
3. Click Settings > Resources > File Sharing
4. Add the folder you want to share

![1. Open Docker Desktop, 2. Click the Settings button then Resources then File Sharing, 3. Add the folder you want to share with the Docker container](images/docker-volume-sharing.png "Docker volume sharing screenshot")

## Downloading the tool

[Download options](temp_download_options.md) (WIP)

## Running the tool

1. Start the tool using `customer.bat <input folder> <output folder>`
    - Note that Docker volume names MUST be absolute paths
2. Open your browser to http://localhost:3000
3. Press `F1` or `cmd + shift + p`
4. Type "Run UI Upgrade Helper". You should see multiple available functions.
5. Click the function you want to run
6. Wait a few minutes seconds for the tool to finish
7. The files in `INPUT_FOLDER` will be scanned and the results placed in `OUTPUT_FOLDER`
8. Click the `Source Control: Git` button on the left sidebar to inspect the changes

<img style="text-align:center" src="images/upgrade-helper.gif" width="500">

## Rules

See the [rules page](customer/customer_rules.md) for steps to add new rules.

## Ignoring files

See the [ignoring files page](customer/customer_ignores.md) for steps to ignore certain files and folders.
