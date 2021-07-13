[<< Back to the developer guide](../developer_guide.md)

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
4. Update `package.json` `scripts: { }` section to include `install:your-function`
5. Update `package.json` `scripts: { start }` section to start the new function
6. Update `dev.bat`/`dev.sh` to map the source code from the local machine to the Docker container. This will allow you to recompile the code on the fly.
7. Run the Docker container using `dev.bat`/`dev.sh`
8. Open http://localhost:3000
9. Press `ctrl + shift + p` or `F1`.
10. Type `Run SPM UI Upgrade Helper - <function name>` and you should see your new function listed.
11. Click the function and you should see the Docker container's log print "Hello, world!"

FIXME Should we use a prefix or place all services in a 'services' folder so lerna can pick them up?

FIXME Can we automatically install a service `dev.bat`/`dev.sh` if we are using `packages/services-*`?

FIXME If we remove sub-packages do we only need to install at the root?

FIXME Can we automatically map the source code in `dev.bat`/`dev.sh` if we are using `packages/services-*`?

## Notes

- When the Docker container starts, the `code-generation` package uses the data in `config/tools.json` to generate functions which are stored in `packages/vs-upgrade-helper-plugin/src/functions.ts`. It will also generate a new `server.js` file in the specific package. You can run `yarn generate-files` from the root folde to test this out yourself.
