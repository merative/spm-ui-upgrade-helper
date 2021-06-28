## Description

Test that replace selectors are applied most-specific first

## Rules

    {
      "SelectorReplace": [
        { "value": ".replace-this", "newValue": ".foo" },
        { "value": "div.replace-this", "newValue": ".bar" }
      ]
    }

## Input

    div.replace-this {
        margin-bottom: 1px;
        margin-top: 1px;
    }

    .replace-this {
        margin-bottom: 2px;
        margin-top: 2px;
    }

## Expected

    .bar {
      margin-bottom: 1px;
      margin-top: 1px;
    }

    .foo {
      margin-bottom: 2px;
      margin-top: 2px;
    }
