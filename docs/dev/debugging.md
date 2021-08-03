[<< Back to the developer guide](developer_guide)

# Debugging

## Docker

If there is a problem with the Docker container you can run one of the following commands. The first command will run bash inside a running container, the second will start a new container.

    docker exec --tty --interactive spm-ui-upgrade-helper bash
    docker run  --tty --interactive --entrypoint bash spm-ui-upgrade-helper:latest

## Versions

You can see the version and/or commit hash that the Docker image was built from by looking at the first few lines of the logs. Here we can see we are running version `0.0.11` which was built against commit hash `7c56370`.

    yarn run v1.22.4
    $ yarn initial-check && npm-run-all --parallel start-theia start-tools
    $ cd packages/initial-check && yarn start
    $ node start.js
    Success: Found version number: 0.0.11
    Success: Found commit hash: 7c56370
    Success: Found long commit hash: 7c5637011db15b104eb3bc6cbc37b6bc517fc8d5
    Success: Wrote a test file to output folder to ensure it was writeable
    Initial checks successful

## VSCode

1. Open a new VSCode window containing the vs-upgrade-helper-plugin folder only.
2. Add a breakpoint.

![1. Open a new VSCode window containing the vs-upgrade-helper-plugin folder only. 2. Add a breakpoint.](../images/debug_1.png "Debugging steps screenshot 1")

3. Select the Run/Debug view.
4. Select "Run Extension" and click the play button.

![3. Select the Run/Debug view. 4. Select "Run Extension" and click the play button.](../images/debug_2.png "Debugging steps screenshot 2")

5. A new window will open. Press ctrl + shift + p and select 'Run SPM UI Upgrade Helper'.

![5. A new window will open. Press ctrl + shift + p and select 'Run SPM UI Upgrade Helper'.](../images/debug_3.png "Debugging steps screenshot 3")

6. In the original window you will see your breakpoints being hit and can debug as normal.

![6. In the original window you will see your breakpoints being hit and can debug as normal.](../images/debug_4.png "Debugging steps screenshot 4")
