---
title: Ignoring files
---

You can ignore files that you do not want to be affected by the tool. Ignore certain files by creating a file called `.spm-uiuh-ignore` that contains patterns to ignore. Place the `.spm-uiuh-ignore` file in the root of your 7.0.11.0 development environment.

The file follows the same rules as a [.gitignore](http://git-scm.com/docs/gitignore) file. All paths are relative to the `.spm-uiuh-ignore` file location.

## Example .spm-uiuh-ignore file

    # Ignore files in the following folders
    /EJBServer/components/Foo
    /EJBServer/components/Bar
    /EJBServer/components/Muk*

    # Ignore .abc and .xyz files:
    **/*.abc
    **/*.xyz
