[<<< Back to the developer guide](../developer_guide.md)

# Adding a new function

1. Add a new tool to the list at `config/tools.json` by copying the existing tool format.
2. Update `packages/vs-upgrade-helper-plugin/package.json` sections `activationEvents: []` and `contributes: { commands: [] }` to include the new function.
3. Create a new package with an `index.js` file containing an `execute` method. This method will be triggered when the IDE shortcut is invoked.
```
const execute = () => {
  console.log("Hello, world!");
}
module.exports = { execute };
```
4. Update `run.bat`/`run.sh` to map the source code from the local machine to the docker container. This will allow you to recompile the code on the fly.
5. Run the docker container using `run.bat`/`run.sh`
6. Open http://localhost:3000
7. Press `ctrl + shift + p` or `F1`.
8. Type `Run UI Upgrade Helper - <function name>` and you should see your new function listed.
9. Click the function and you should see the docker container's log print "Hello, world!"

FIXME Root package.json lerna command needs to be updated (Should we use a prefix or place all tools in a 'tools' folder so lerna can pick them up?)

FIXME Can I automatically map `run.bat`/`run.sh` by mapping `packages/tools-*`?

## Notes

- When the docker container starts, the `code-generation` package uses the data in `config/tools.json` to generate functions which are stored in `packages/vs-upgrade-helper-plugin/src/functions.ts`. It will also generate a new `server.js` file in the specific package. You can run `yarn generate-files` from the root folde to test this out yourself.
