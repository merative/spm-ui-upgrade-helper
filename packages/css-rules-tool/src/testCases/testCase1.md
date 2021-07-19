## Description

Test that selectors are correctly removed

Here is some more text from the paragraph.

## Rules

    {
      "SelectorRemove": [
        { "value": ".legacy-selector .that-has-to-be-removed" }
      ]
    }

## Input

    body.modal div.legacy-selector .that-has-to-be-removed .foo{
        line-height : 1.22em; }

## Expected

    body.modal div .foo {
      line-height: 1.22em;
    }
