[<< Back to the developer guide](../developer_guide)

# Installation

## Prerequisites

### Software

- Node >= 12.14.1 AND < 13.
    - [Not Node 14. Eclipse Theia does not support it.](https://www.gitmemory.com/issue/eclipse-theia/theia/8920/754781284)
- Docker Desktop

## Steps

1. Clone the repo with `git clone git@github.com:IBM/spm-ui-upgrade-helper.git`
2. Run `yarn install`
3. Run `yarn install:all`
4. Run the following commands (not strictly necessary but it will greatly speed up the Docker build)
    - `docker pull theiaide/theia:1.14.0`
    - `docker pull node:12.18.3`
    - `docker pull node:12.18.3-alpine`
5. Build the container with `yarn build:dev`
6. Start the container with `dev.bat`/`dev.sh`

## Notes

- There are two build commands: `build:dev` and `build:release`. The former will add development shortcuts to all services so that they can be run individually.
