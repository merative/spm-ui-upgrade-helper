---
title: Installation
---

## Prerequisites

### Software

- Node >= 12.14.1 AND < 13.
    - [Not Node 14. Eclipse Theia does not support it.](https://www.gitmemory.com/issue/eclipse-theia/theia/8920/754781284)
- Docker Desktop

## Docker Desktop setup

Once installed, you will need to allow Docker Desktop to access certain paths on the local filesystem. These will be the folders that the tool will work on i.e. your input data folder, plus an output data folder where it will write the modified data.

1. Open Docker Desktop.
2. Click Settings > Resources > File Sharing.
3. Share your input data folder(s)
4. Share a temporary output folder, e.g. `/tmp/upgrade` or `c:\temp\upgrade`
    - Note that the output folder will be wiped, so be careful! Do NOT point this at your v8 development environment.

![1. Open Docker Desktop, 2. Click the Settings button then Resources then File Sharing, 3. Add the folder you want to share with the Docker container](../../images/docker-volume-sharing.png "Docker volume sharing screenshot")

## Build steps

1. Clone the repo with `git clone git@github.com:IBM/spm-ui-upgrade-helper.git`
2. Run `yarn install-all`
3. Run the following commands (not strictly necessary but it will greatly speed up the Docker build)
    - `docker pull theiaide/theia:1.14.0`
    - `docker pull node:12.18.3`
    - `docker pull node:12.18.3-alpine`
4. Build the container with `yarn build:dev`
5. Build the acceptance test data with `yarn at:build kitchen-sink`
6. Start the container with `acceptance-test.bat`/`acceptance-test.sh`

## Notes

- There are two build commands: `build:dev` and `build:release`. The former will add development shortcuts to all services so that they can be run individually.
