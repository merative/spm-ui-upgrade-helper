---
title: Ignoring files
---

Customers can ignore certain files by creating a file called `.spm-uiuh-ignore` containing patterns to ignore. Place this file in the root of your 7.0.11.0 development environment.

This can be used to ignore files that you do not want to be affected by the tool.

The file follows the same rules as a [.gitignore](http://git-scm.com/docs/gitignore) file. All paths are relative to the `.spm-uiuh-ignore` file location.

## Example .spm-uiuh-ignore file

    # Ignore files in the following folders
    /EJBServer/components/Foo
    /EJBServer/components/Bar
    /EJBServer/components/Muk*

    # Ignore .abc and .xyz files:
    **/*.abc
    **/*.xyz
