## Description

Test that the comments are placed in the correct location

## Rules

    {
      "SelectorRemove": [
        { "value": ".remove-this" }
      ],
      "SelectorReplace": [
        {
          "value": ".replace-this",
          "newValue": ".new-value"
        }
      ]
    }

## Input

    .remove-this,
    .do-not-touch {
      float: left;
    }

    .do-not-touch {
      width: auto;
    }

    .remove-this {
      margin-top: 15px;
    }

    .do-not-touch {
      padding-left: 15px;
    }

    .replace-this {
      width: 100%;
    }

## Expected

    .do-not-touch {
      float: left;
    }

    .do-not-touch {
      width: auto;
    }

    .do-not-touch {
      padding-left: 15px;
    }

    .new-value {
      width: 100%;
    }
