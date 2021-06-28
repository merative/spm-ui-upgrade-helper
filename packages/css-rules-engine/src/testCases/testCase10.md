## Description

Test braces within comments work ok

## Rules

    {
      "SelectorRemove": [
        { "value": ".foo" }
      ]
    }

## Input

    .foo,
    .bar {
      /* {something} */
      color: red;
    }

    .foo,
    .qux {
      /* } */
      color: blue;
    }

## Expected

    .bar {
      /* {something} */
      color: red;
    }

    .qux {
      /* } */
      color: blue;
    }
