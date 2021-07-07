[<< Back to the customer guide](../customer_guide.md)

# Rules

## Adding new rules

Customers can add new rules by creating an environment variable `ADDITIONAL_RULES` that points to a folder. Any `.json` files in this folder will be loaded in addition to the default rules.

For example: `set ADDITIONAL_RULES=.\my_rules` (Windows) or `export ADDITIONAL_RULES=./my_rules` (Mac).

Example rules file:

    {
      "SelectorRemove": [
        { "value": ".delete-this-selector" },
        { "value": ".delete-this-selector .and-this" }
        { "value": ".delete-this-selector .and-all-of-this" }
      ],
      "SelectorReplace": [
        {
          "value": ".foo .qux",
          "newValue": ".bar .qux"
        }
      ]
    }

All of the values in `SelectorRemove` will be deleted. The values in `SelectorReplace` will be replaced by `newValue`. The order in which the rules are applied is described below.

## Ordering of rules

The following steps determine the order of the rules:

- All OOTB rules are loaded.
- Any additional rules files found in the `ADDITIONAL_RULES` folder are loaded.
- The JSON data of all of these files is merged.
- The rules are sorted by length, with the longest items first, inside each of their respective categories `SelectorRemove` and `SelectorReplace`.
- The `SelectorRemove` rules are applied first, followed by the `SelectorReplace` rules.

## Updating the OOTB rules

If you want to update the OOTB rules so other customers have access to them, [open a PR](https://github.com/IBM/spm-ui-upgrade-helper).
