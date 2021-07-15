[<< Back to the developer guide](../developer_guide.md)

# Installation

## Prerequisites

### Software

- Node >= 12.14.1 AND < 13.
    - [Not Node 14. Eclipse Theia does not support it.](https://www.gitmemory.com/issue/eclipse-theia/theia/8920/754781284)

## Steps

1. Clone the repo with `git clone git@github.com:IBM/spm-ui-upgrade-helper.git`
2. Run `yarn install`
3. Build the container with `yarn build:dev`
4. Start the container with `dev.bat`/`dev.sh`

## Notes

- There are two build commands: `build:dev` and `build:release`. The former will add development shortcuts to all services so that they can be run individually.
