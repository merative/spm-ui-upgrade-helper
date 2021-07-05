[<<< Back to the customer guide](../customer_guide.md)

# Downloading the tool

_NB: This page is a work in progress. We will eventually remove most of the "Getting the tool" options._

## Option 1 - Public Docker

_Note: Available to all customers._

Customer pulls latest docker image from public Docker hub e.g.:

1. Run `docker pull @ibm/spm-ui-upgrade-helper:latest`

## Option 2 - Internal IBM Docker

_Note: Available to customers with IBM lab services on site only._

Customer pulls latest docker image from internal IBM Docker hub e.g.:

1. Run `docker login wh-govspm-docker-local.artifactory.swg-devops.com`
2. Run `docker pull wh-govspm-docker-local.artifactory.swg-devops.com/artifactory/wh-govspm-docker-local/spm-ui-upgrade-helper/spm-ui-upgrade-helper:latest`

## Option 3 - Public Github

_Note: Available to all customers, but more effort than option 1._

1. Download code from https://github.com/IBM/spm-ui-upgrade-helper
2. Run `yarn install`
3. Run `yarn docker-tasks build`
4. Run `spm-ui-upgrade-helper.bat`/`spm-ui-upgrade-helper.sh`

## Option 4 - Standard Release Process

_Note: Available to all customers, but more effort than options 1 & 3._

- Release the tool as a new asset in the standard SPM way.
- Customers download the tool from IBM Fix Central.
- Install steps are very similar to options 1-3.

(Note: Release vehicle can still be a Docker image.)
