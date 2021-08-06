---
title: Custom configuration
---

You can override the default configuration by creating a `.spm-uiuh-config` file in the root of your 7.0.11.0 development environment.

The file contents should be JSON and should match the structure of the [default configuration](https://github.com/IBM/spm-ui-upgrade-helper/blob/main/packages/shared-utils/src/config.js). Note that you only need to include the items you wish to override.

Paths are either absolute paths within the docker container or else relative paths from the perspective of `packages/main-tool`, depending on the context in which they are used.

## Example .spm-uiuh-config file

    {
      globs: [
        "**/*"
      ],
    }
