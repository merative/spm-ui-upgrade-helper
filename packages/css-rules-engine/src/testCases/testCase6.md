## Description

Test that remove selectors are applied most-specific first

For example, if we want to apply the following 'remove' rules:

    .remove-this
    body .remove-this

to this CSS:

    body .remove-this {
        margin-bottom: 1px;
        margin-top: 1px;
    }

We need to apply 'body .remove-this' first, otherwise we would end up with this:

    body {
      margin-bottom: 1px;
      margin-top: 1px;
    }

## Rules

    {
      "SelectorRemove": [
        { "value": ".remove-this" },
        { "value": "body .remove-this" }
      ]
    }

## Input

    body .remove-this {
        margin-bottom: 1px;
    }

    .foo,
    .remove-this,
    .bar,
    .qux,
    body .remove-this {
        margin-bottom: 2px;
    }

## Expected

    .foo,
    .bar,
    .qux {
      margin-bottom: 2px;
    }
