## Description

Test that SelectorRemove rules are applied before SelectorReplace rules

## Rules

    {
      "SelectorRemove": [
        { "value": ".legacy-selector .that-has-to-be-removed" }
      ],
      "SelectorReplace": [
        { "value": ".legacy-selector .that-has-to-be-removed", "newValue": ".we-should-not-see-this" }
      ]
    }

## Input

    .legacy-selector .that-has-to-be-removed {
        margin-bottom: 1px;
        margin-top: 1px;
    }

    .foo,
    .legacy-selector .that-has-to-be-removed,
    .bar {
        margin-bottom: 2px;
        margin-top: 2px;
    }

## Expected

    .foo,
    .bar {
      margin-bottom: 2px;
      margin-top: 2px;
    }
