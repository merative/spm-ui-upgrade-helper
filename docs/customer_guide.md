[<< Back to home](index.md)

# Customer guide

## Initial setup

1. Set up a 7.0.11.0 development environment.
2. Set up a v8 development environment.
3. Install Docker Desktop for [Windows](https://docs.docker.com/docker-for-windows/install/) or [Mac](https://docs.docker.com/docker-for-mac/install/).

Once installed, you will need to allow Docker Desktop to access certain paths on the local filesystem. These will be the folders that the tool will work on i.e. your SPM source code folder that will provide the input data, plus an output folder where it will write the modified data.

4. Open Docker Desktop.
5. Click Settings > Resources > File Sharing.
6. Add the folder you want to share.

![1. Open Docker Desktop, 2. Click the Settings button then Resources then File Sharing, 3. Add the folder you want to share with the Docker container](images/docker-volume-sharing.png "Docker volume sharing screenshot")

## Downloading the tool

[Download options](temp_download_options.md) (WIP)

## Running the tool

1. Download the batch file or shell script:
    - `curl -L https://raw.githubusercontent.com/IBM/spm-ui-upgrade-helper/main/spm-ui-upgrade-helper.bat -o spm-ui-upgrade-helper.bat` (Windows)
    - `curl -L https://raw.githubusercontent.com/IBM/spm-ui-upgrade-helper/main/spm-ui-upgrade-helper.sh -o spm-ui-upgrade-helper.sh` (Linux)
        - If using Linux, make the shell script executable with `chmod +x spm-ui-upgrade-helper.sh`
2. Start the tool using `spm-ui-upgrade-helper.bat <version> <input folder> <output folder>` or `./spm-ui-upgrade-helper.sh <version> <input folder> <output folder>`.
    - `<version>` is typically "latest".
    - `<input folder>` should be your 7.0.11.0 development environment (set it to the root folder as there are files in both webclient and EJBServer that the tool will touch.)
    - Run `chmod -R 777 <output folder>` so that Docker can interact with the output folder.
    - `<output folder>` will be wiped, so be careful.
    - `<output folder>` should be a temporary folder e.g. `c:\temp\upgrade` or `/tmp/upgrade`.
    - Docker volume names such as the input and output folders MUST be absolute paths.
3. Open your browser to http://localhost:3000
4. Press `F1` or `cmd + shift + p`.
5. Type "Run SPM UI Upgrade Helper" and click on the shortcut.
6. Wait a few minutes for the tool to finish.
7. The files in `<input folder>` will be scanned and the results placed in `<output folder>`.
8.  Click the `Source Control: Git` button on the left sidebar to inspect the changes.

<img style="text-align:center" src="images/upgrade-helper.gif" width="500">

9. Copy `<output folder>` into your v8 development environment.
10. Build and test v8.

## Errors

To see the container logs run `docker logs spm-ui-upgrade-helper`.

You can save the logs to a file using e.g. `docker logs spm-ui-upgrade-helper > /tmp/logs.txt`.

## Additional options

In most cases, you can run this tool without modification, assuming that your SPM version is a standard installation.

If your installation is non-standard, you might need to update rules or ignore files to suit your customer environment.

### Rules

See the [rules page](customer/customer_rules.md) for steps to add new rules.

### Ignoring files

See the [ignoring files page](customer/customer_ignores.md) for steps to ignore certain files and folders.
