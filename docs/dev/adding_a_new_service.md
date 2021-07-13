[<< Back to the developer guide](../developer_guide.md)

# Adding a new service

1. Add a new service to the list at `config/tools.json` by copying the existing tool format.
2. Your new service should be disabled while it is being built. You will be able to run it via a debug shortcut (see below.)
3. Create a new package with an `index.js` file containing an `execute` method. This method will be triggered when the IDE shortcut is invoked.
```
const execute = () => {
  console.log("Hello, world!");
}
module.exports = { execute };
```
4. Update `package.json` `scripts: { }` section to include `install:your-service`
5. Update `package.json` `scripts: { start }` section to start the new service
6. Run `yarn build:dev` to build the Docker image. This will include a shortcut to run your new service on its own.
7. Update `dev.bat`/`dev.sh` to map the source code from the local machine to the Docker container. This will allow you to recompile the code on the fly.
8. Run the Docker container using `dev.bat`/`dev.sh`
9. Open http://localhost:3000
10. Press `ctrl + shift + p` or `F1`.
11. Type `Run SPM UI Upgrade Helper - <your service name> (DEBUG)` and you should see your new service listed.
12. Click the service and you should see the Docker container's log print "Hello, world!"

FIXME Should we use a prefix or place all services in a 'services' folder so lerna can pick them up?

FIXME Can we automatically install a service `dev.bat`/`dev.sh` if we are using `packages/services-*`?

FIXME If we remove sub-packages do we only need to install at the root?

FIXME Can we automatically map the source code in `dev.bat`/`dev.sh` if we are using `packages/services-*`?

## Notes

- `main-service` is triggered via the "Run SPM UI Upgrade Helper" shortcut. It will trigger all enabled tools.
- To build and test your tool while keeping is hidden from the customer, `build:dev` generates additional shortcuts to every individual service, regardless if whether they are enabled or not.
- When the Docker container starts, the `code-generation` package uses the data in `config/tools.json` to generate functions which are stored in `packages/vs-upgrade-helper-plugin/src/functions.ts`. It will also generate a new `server.js` file in the specific package. You can run `yarn generate-files` from the root folder to test this out yourself.
