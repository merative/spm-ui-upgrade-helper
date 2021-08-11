---
title: Adding a new tool
---

- Add a new tool to the list at `config/tools.json` by copying the existing tool format.
- The new tool MUST end with `-tool`. Various scripts depend on this naming convention.
- Your new tool should be feature flagged off while under development by setting `enabled: false`. You will still be able to run it via a developer shortcut (see below.)
- Create a new package with an `index.js` file containing the following code.
    - The `execute` method will be triggered when the IDE shortcut is invoked.
    - The `overrides` argument is used when the tool is invoked from `main-tool` and also for testing.
    - It is important to use exactly this code so that the correct setup is performed based on whether the tool is invoked from `main-tool` or via a debug shortcut.

```
const utils = require("../shared-utils/sharedUtils");

const execute = overrides => {
  const config = utils.loadConfig(overrides);
  utils.init(config);

  console.log("Hello, world!");
}

module.exports = { execute };
```

- Run `yarn add express nodemon`. These packages will be required later.
- Update the range of ports used. Search VSCode for `4000-40` to see all instances and update them to include your port.
- Run `yarn build:dev` to build the Docker image. This will add a shortcut to Eclipse Theia to run your new tool on its own.
- Update `dev.bat`/`dev.sh` to map the source code from the local machine to the Docker container. This will allow you to edit your code on the fly.
- Run the Docker container using `dev.bat`/`dev.sh`
- Open http://localhost:3000
- Press `ctrl + shift + p` or `F1`.
- Type "(DEBUG) Run SPM UI Upgrade Helper - &lt;your tool name&gt;" and you should see your new tool listed.
- Click the tool and you should see the Docker container's log print "Hello, world!"
- Implement the tests and code for your tool.
- Add some additional tests to `packages/main-tool` and some additional data to `packages/acceptance-tests/scripts/datasets.json` in the `kitchen-sink` dataset. Just add a few tests. The majority of tests should be in the tool's package.
- When you are ready to release your tool to the customer, set `enabled: true` in `config/tools.json`, which will cause it to be run as part of the main tool. Test this and then release a new version.

## Notes

- The first two lines of boilerplate allow the tool to be run independently in dev mode and also as part of the main tool.
- To build and test your tool while keeping it hidden from the customer, `build:dev` generates debug shortcuts to every individual tool, regardless if whether they are enabled or not. You can see these in Eclipse Theia by typing "(DEBUG) Run SPM UI Upgrade Helper - &lt;your tool name&gt;".
- `main-tool` is triggered via the "Run SPM UI Upgrade Helper" shortcut. It will trigger enabled tools only. This is the only shortcut that customers will see.
- When the Docker container starts, the `code-generation` package uses the data in `config/tools.json` to generate a `server.js` file for each package. It also generates Eclipse Theia plugins as `packages/vs-upgrade-helper-plugin/src/functions.ts`.
- Flagging the feature off during development means you can can continue to commit to `main` every day. Committing to `main` every day means no painful merges, and if your branch breaks something else you will find out sooner rather than later.
