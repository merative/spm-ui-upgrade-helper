## Description

Test comments above the selectors and within the CSS body

## Rules

    {
      "SelectorRemove": [
        { "value": ".foo" }
      ]
    }

## Input

    /* A comment */
    .foo, .bar { color: red; /* Another comment */ }

## Expected

    /* A comment */

    .bar {
      color: red;
      /* Another comment */
    }
