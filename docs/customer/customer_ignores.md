[<< Back to the UI Upgrade Helper guide](../ui_upgrade_helper_guide.md)

# Ignoring files

Customers can ignore certain files by creating a file called `.spm-uiuh-ignore` containing patterns to ignore. It follows the same rules as a [.gitignore](http://git-scm.com/docs/gitignore) file. All paths are relative to the `.spm-uiuh-ignore` file location.

## Example .spm-uiuh-ignore file

    # Ignore files in /EJBServer/components/Foo
    /EJBServer/components/Foo

    # Ignore .xyz files:
    **/*.xyz
