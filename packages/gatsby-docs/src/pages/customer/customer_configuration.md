---
title: Custom configuration
---

You can override the default configuration by creating a `.spm-uiuh-config` file in the root of your 7.0.11.0 development environment.

This can be used to include files that are excluded by default or to customize the tools.

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
      iconReplacerTool: {
        // File extensions to exclude when checking for icon references
        exclude: ["zip", "class", "jpg", "jpeg", "gif", "png"],
        // Directory containing v8 icon files
        iconFolder: "./source_files",
        // File containing icon mappings from v7 to v8
        iconMappings: "./icon_mappings.json",
      },
      // Window sizing rules
      windowSizeTool: {
        rules: "../window-size-tool/rules.json",
      }
    }
