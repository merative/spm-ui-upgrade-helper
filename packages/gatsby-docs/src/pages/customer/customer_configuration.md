---
title: Custom configuration
---

You can override the default configuration by creating a `.spm-uiuh-config` file in the root of your 7.0.11.0 development environment.

The file contents should be JSON and should match the structure of the [default configuration](https://github.com/IBM/spm-ui-upgrade-helper/blob/main/packages/shared-utils/src/config.js). Note that you only need to include the items you wish to override.

Paths are relative to the input folder.

## Example .spm-uiuh-config file

    {
      // Globs are relative to the input folder
      globs: [ "**/*" ],
      // Log verbosity. Options are quiet/normal/debug.
      logLevel: "debug",
      // Folder where CSS rules are located
      cssRulesTool: {
        rulesFolder: "custom-rules",
      },
      // File extensions to exclude when checking for icon references
      iconReplacerTool: {
        exclude: ["zip", "class", "jpg", "jpeg", "gif", "png"],
      },
      // Window sizing rules
      windowSizeTool: {
        rules: "../window-size-tool/rules.json",
      }
    }
