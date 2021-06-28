<<< Back to the [customer guide](../customer_guide.md)

# Rules

## Ordering of Rules

The following steps determine the order of the rules:

- All OOTB rules are loaded, plus any additional rules files found in the `ADDITIONAL_RULES` folder.
- The JSON data of all of these files is merged.
- The rules are sorted by length, with the longest items first, inside each of their respective categories `SelectorRemove` and `SelectorReplace`.
- The `SelectorRemove` rules are applied first, followed by the `SelectorReplace` rules.

## Adding new Rules

Customers can add new rules by creating an environment variable `ADDITIONAL_RULES` that points to a folder. Any `.json` files in this folder will be loaded, in addition to the default rules.
For example: `set ADDITIONAL_RULES=.\my_rules` (Windows) or `export ADDITIONAL_RULES=./my_rules` (Mac).
