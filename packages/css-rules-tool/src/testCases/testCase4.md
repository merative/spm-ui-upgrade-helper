## Description

Test that if all selectors are removed the CSS body is removed as well

## Rules

    {
      "SelectorRemove": [
        { "value": ".legacy-selector .that-has-to-be-removed" }
      ]
    }

## Input

    .legacy-selector .that-has-to-be-removed {
        margin-bottom: 1px;
        margin-top: 1px;
    }

## Expected
