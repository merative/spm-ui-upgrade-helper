## Description

Test that selectors inside a list of selectors are correctly removed

## Rules

    {
      "SelectorRemove": [
        { "value": ".legacy-selector .that-has-to-be-removed" },
        { "value": ".remove-this" }
      ]
    }

## Input

    .anotherCss {
      margin-bottom: 5px;
    }

    h3.dont-touch-this-line,
    .legacy-selector .that-has-to-be-removed,
    body.dont-touch-this-line span.collapse-title {
        margin-bottom: 5px;
        margin-top: 3px;
    }

    .remove-this,
    .foo,
    .remove-this {
        margin-bottom: 3px;
    }

    .foo,
    .remove-this,
    .bar,
    .remove-this,
    .qux {
        margin-bottom: 4px;
    }

    .foo,
    .remove-this,
    .remove-this,
    .remove-this,
    .bar {
        margin-bottom: 5px;
    }

## Expected

    .anotherCss {
      margin-bottom: 5px;
    }

    h3.dont-touch-this-line,
    body.dont-touch-this-line span.collapse-title {
      margin-bottom: 5px;
      margin-top: 3px;
    }

    .foo {
      margin-bottom: 3px;
    }

    .foo,
    .bar,
    .qux {
      margin-bottom: 4px;
    }

    .foo,
    .bar {
      margin-bottom: 5px;
    }
