[<<< Back to the developer guide](../developer_guide.md)

# Debugging

## Docker

If there is a problem with the docker container you can run

    docker run --tty --interactive --entrypoint bash ui-upgrade-helper:latest

This will place you inside a new docker container where you can take a look around.

## Command-line

1. Run `cd packages/css-rules-engine`
2. Run `yarn runOnce`

## VSCode

1. Open a new VSCode window containing the vs-upgrade-helper-plugin folder only.
2. Add a breakpoint.

![1. Open a new VSCode window containing the vs-upgrade-helper-plugin folder only. 2. Add a breakpoint.](images/debug_1.png "Debugging steps screenshot 1")

3. Select the Run/Debug view.
4. Select "Run Extension" and click the play button.

![3. Select the Run/Debug view. 4. Select "Run Extension" and click the play button.](images/debug_2.png "Debugging steps screenshot 2")

5. A new window will open. Press ctrl + shift + p and select 'Run UI Upgrade Helper'.

![5. A new window will open. Press ctrl + shift + p and select 'Run UI Upgrade Helper'.](images/debug_3.png "Debugging steps screenshot 3")

6. In the original window you will see your breakpoints being hit and can debug as normal.

![6. In the original window you will see your breakpoints being hit and can debug as normal.](images/debug_4.png "Debugging steps screenshot 4")