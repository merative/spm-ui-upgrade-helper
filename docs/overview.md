[<< Back to home](index.md)

# Overview

The SPM UI Upgrade Helper helps to automates the upgrade process by applying the same UI changes we have made to v8 to a customer's 7.0.11.0 development environment.

To get started, see the [UI Upgrade Helper guide](ui_upgrade_helper_guide.md).

## Tools

All of the tools are run sequentially via a single command, as detailed in the [UI Upgrade Helper guide](ui_upgrade_helper_guide.md).

### CSS Rules Tool

Scans customer stylesheets and updates the CSS selectors to match the changes we have made when moving to the Carbon design system.

- Iterates over customer CSS files and applies the rules codified in [packages/css-rules-tool/rules/*.json](https://github.com/IBM/spm-ui-upgrade-helper/tree/main/packages/css-rules-tool/rules).

### Icon Replacer Tool

Scans customer files for references to v7 icons and replaces them with their v8 counterparts.

Also scans for icon files and replaces them.

- Loads icon replacement mappings from [packages/icon-replacer-tool/icon-mappings.json](https://github.com/IBM/spm-ui-upgrade-helper/blob/main/packages/icon-replacer-tool/icon_mappings.json).
- Iterates over customer files and replaces any references to old icons with new icons.
- It will also replace any icon files that it finds.
