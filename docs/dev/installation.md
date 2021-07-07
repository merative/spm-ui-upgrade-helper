[<< Back to the developer guide](../developer_guide.md)

# Installation

## Prerequisites

### Software

- Node >= 12.14.1 AND < 13.
    - [Not Node 14. Eclipse Theia does not support it.](https://www.gitmemory.com/issue/eclipse-theia/theia/8920/754781284)

### Add .npmrc file

In order for Docker to access the `@spm/bulk-image-updater` library you will need to create a `.npmrc` file in the root folder:

```
@spm:registry=https://eu.artifactory.swg-devops.com/artifactory/api/npm/wh-govspm-npm-local/
//eu.artifactory.swg-devops.com/artifactory/api/npm/wh-govspm-npm-local/:_auth=<artifactory auth>
//eu.artifactory.swg-devops.com/artifactory/api/npm/wh-govspm-npm-local/:username=<artifactory email>
//eu.artifactory.swg-devops.com/artifactory/api/npm/wh-govspm-npm-local/:email=<artifactory email>
//eu.artifactory.swg-devops.com/artifactory/api/npm/wh-govspm-npm-local/:always-auth=true
```

You can get the `_auth` value by running `curl -u $ARTIFACTORY_USER:$ARTIFACTORY_TOKEN https://eu.artifactory.swg-devops.com/artifactory/api/npm/auth`

**NB:** Do not ship this file. Do not source-control this file.

The `Dockerfile` copies the `.npmrc` file into the Docker environment, runs `yarn install`, and deletes the file afterwards. So there will be no secrets inside the final Docker container.

## Steps

1. Clone the repo with `git clone git@github.ibm.com:WH-GovSPM/UI-Upgrade-Helper.git`
2. Run `yarn install`
3. Build the container with `yarn docker-tasks build`
4. Start the container with `dev.bat`/`dev.sh`
