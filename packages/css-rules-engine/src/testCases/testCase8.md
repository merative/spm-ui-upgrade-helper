## Description

Test that when a remove selector includes a space the space is preserved

If we were to remove ".foo .bar" from the CSS below and not preserve the space:

    .a.foo .bar.b {
      margin-bottom: 1px;
    }

we would incorrectly end up with:

    .a.b {
      margin-bottom: 1px;
    }

## Rules

    {
      "SelectorRemove": [
        { "value": ".foo .bar" }
      ]
    }

## Input

    .a.foo .bar.b {
        margin-bottom: 5px;
        margin-top: 3px;
    }

## Expected

    .a .b {
      margin-bottom: 5px;
      margin-top: 3px;
    }
