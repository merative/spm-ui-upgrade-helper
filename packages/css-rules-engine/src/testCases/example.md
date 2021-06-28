## Description

This line is used as the name of the test case.

The test cases are written in Markdown and are parsed by `getTestCases.js`. I wrote them this way
because it's a lot easier to read compared to JS or JSON.

You can add extra lines of description if you like. Only the first line is used for the test name.

Notes:

- The filename will be appended to the test name to make it easier to trace errors.
- Stick to this layout as closely as possible. See the existing test cases for more examples.
- Do not put sub-headings within this 'Description' section.
- The 'Rules' section will be parsed as JSON so don't forget to quote the keys e.g. "value": ".selector".
- The 'Input' section will be parsed by the CSS parser. Any formatting is fine as long as it is valid CSS.
- The 'Expected' section will be read as a string. Note that it can be empty.
- The output will be prettified by default. You can't avoid this. So 'Expected' CSS needs to look pretty.
- Each section heading can have as many or as few #'s as you want as long as there is at least one.
- All `.md` files in the `testCases` folder will be globbed up and parsed by `getTestCases.js`.
- Make sure your `.md` files use Unix LF line endings, not Windows CRLF.
- You can append `.only` to one or more filenames (e.g. `testCase1.md.only`) to only run those tests.

## Rules

    {
      "SelectorRemove": [
        { "value": ".remove-this" }
      ],
      "SelectorReplace": [
        { "value": ".replace-this", "newValue": ".new-value" }
      ]
    }

## Input

    body.modal .remove-this div.replace-this select{
        line-height : 1.22em; }

## Expected

    body.modal div.new-value select {
      line-height: 1.22em;
    }
