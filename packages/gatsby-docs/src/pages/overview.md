---
title: Overview
---

The SPM UI Upgrade Helper helps to automates the upgrade process by applying the same UI changes we have made in SPM v8 to a customer's SPM 7.0.11.0 development environment.

To get started, see the [UI Upgrade Helper guide](customer/customer_setup).

## Tools

All of the tools are run sequentially via a single command, as detailed in the [UI Upgrade Helper guide](customer/customer_setup).

### CSS Rules Tool

Scans customer stylesheets and updates the CSS selectors to match the changes we have made when moving to the Carbon design system.

- Iterates over customer CSS files and applies the rules codified in [packages/css-rules-tool/rules/*.json](https://github.com/IBM/spm-ui-upgrade-helper/tree/main/packages/css-rules-tool/rules).

Example rules file:

    {
      "SelectorRemove": [
        { "value": ".delete-this-selector" },
        { "value": ".delete-this-selector .and-this" }
        { "value": ".delete-this-selector .and-this-as-well" }
      ],
      "SelectorReplace": [
        {
          "value": ".foo .qux",
          "newValue": ".bar .qux"
        }
      ]
    }

All of the values in `SelectorRemove` will be deleted. The values in `SelectorReplace` will be replaced by `newValue`. The order in which the rules are applied is described below.

#### Ordering of rules

The following steps determine the order of the rules:

- All OOTB rules are loaded.
- The rules are sorted by length, with the longest items first, inside each of their respective categories `SelectorRemove` and `SelectorReplace`.
- The `SelectorRemove` rules are applied first, followed by the `SelectorReplace` rules.

#### Updating the OOTB rules

If you want to update the OOTB rules so other customers have access to them, [open a PR](https://github.com/IBM/spm-ui-upgrade-helper).

### Icon Replacer Tool

Scans customer files for references to v7 icons and replaces them with their v8 counterparts.

Also scans for icon files and replaces them.

- Loads icon replacement mappings from [packages/icon-replacer-tool/icon-mappings.json](https://github.com/IBM/spm-ui-upgrade-helper/blob/main/packages/icon-replacer-tool/icon_mappings.json).
- Iterates over customer files and replaces any references to old icons with new icons.
- It will also replace any icon files that it finds.
