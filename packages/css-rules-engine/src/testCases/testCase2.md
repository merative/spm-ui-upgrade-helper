## Description

Test that selectors are correctly replaced

## Rules

    {
      "SelectorReplace": [
        { "value": "div.legacy-selector", "newValue": ".new-selector" }
      ]
    }

## Input

    body.modal div.legacy-selector .desc-header {
        margin-top: 0;
        margin-bottom: 13px;
        font-weight: normal;
    }

## Expected

    body.modal .new-selector .desc-header {
      margin-top: 0;
      margin-bottom: 13px;
      font-weight: normal;
    }
