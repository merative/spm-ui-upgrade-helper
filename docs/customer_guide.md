<<< Back to [home](../README.md)

# Customer Guide

_NB: This page is a work in progress. We will eventually remove most of the "Getting the tool" options._

## Getting the tool

### Option 1 - Public Docker

_Note: Available to all customers._

Customer pulls latest docker image from public Docker hub e.g.:

1. Run `docker run -v /path/to/input/folder:/home/workspace/input -v /path/to/output/folder:/home/workspace/output /path/to/additional/rules:/home/workspace/rules @ibm/spm/ui-upgrade-helper_upgrade-helper`

### Option 2 - Internal IBM Docker

_Note: Available to customers with IBM lab services on site only._

Customer pulls latest docker image from internal IBM Docker hub e.g.:

1. Run `docker run -v /path/to/input/folder:/home/workspace/input -v /path/to/output/folder:/home/workspace/output -v /path/to/additional/rules:/home/workspace/rules wh-govspm-docker-local.artifactory.swg-devops.com/artifactory/wh-govspm-docker-local/ui-upgrade-helper_upgrade-helper`

### Option 3 - Public Github

_Note: Available to all customers, but more effort than option 1._

1. Download code from https://github.com/IBM/SPM-UI-Upgrade-Helper
2. Run `npm install`
3. Run `docker-compose build`
4. Run `docker-compose up`

### Option 4 - Internal IBM Github

_Note: Available to customers with IBM lab services on site only, but more effort than option 2._

1. Download code from https://github.ibm.com/WH-GovSPM/UI-Upgrade-Helper
2. Run `npm install`
3. Run `docker-compose build`
4. Run `docker-compose up`

### Option 5

_Note: Available to all customers, but more effort than options 1 & 3._

- Release the tool as a new asset in the standard SPM way.
- Customers download the tool from fix central.
- Install steps are very similar to options 1-4.

(Note: Release vehicle can still be a Docker image or source code.)

## Running the tool

1. Start the tool as detailed above
2. Open your browser to http://localhost:3000
3. Press `ctrl + shift + p` or `F1`
4. Type "Run UI Upgrade Helper - CSS" and click the appropriate function
5. Wait a few minutes seconds for the tool to run
6. The files in `INPUT_FOLDER` will be scanned and the results placed in `OUTPUT_FOLDER`
7. Click the 'Source Control: Git' button on the left to inspect the changes

<img style="text-align:center" src="images/upgrade-helper.gif" width="500">

**Note:** There is a gap here because if a customer had V8 and they were happy with the changes they would now copy the results into a V8 build in order to test them fully. Since NC do not have V8 they cannot test the changes in this way. I would consider this risk to be acceptable because we have run the tool against their CSS and it appears that only a small amount of their custom CSS is impacted.

## Rules

- [Rules](customer/customer_rules.md)

## Notes

- If you need to add new rules, see the page on [Rules](customer/customer_rules.md)
- Docker volume names MUST be absolute paths
- You may need to share the local volume paths when using Docker for Windows
    1. Open Docker for Windows
    2. Click the Settings button > Resources > File Sharing
    3. Add the folder you want to share

![1. Open Docker for Windows, 2. Click the Settings button then Resources then File Sharing, 3. Add the folder you want to share with the Docker container](images/docker-volume-sharing.png "Docker volume sharing screenshot")
