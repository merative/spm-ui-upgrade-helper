[<<< Back to the customer guide](../customer_guide.md)

# Ignoring files

Customers can ignore certain input files by creating an environment variable `ADDITIONAL_IGNORE` that points to a folder. Any `.json` files in this folder will be loaded in addition to the default list of ignored files.

For example: `set ADDITIONAL_RULES=.\my_ignores` (Windows) or `export ADDITIONAL_IGNORE=./my_ignores` (Mac).

## Structure of an ignore file

    {
      "tokens": [
        "/bar.txt"
      ],
      "globs": [
        "**/Foo/**"
      ]
    }

When the files are being processed, any file paths that contain a token from the `tokens` array or match a glob from the `globs` array will be ignored.

NB: Use of tokens is preferred for performance reasons. Use of multiple globs may have a significant performance impact.
