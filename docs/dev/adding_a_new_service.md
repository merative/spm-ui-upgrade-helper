[<< Back to the developer guide](../developer_guide.md)

# Adding a new service

1. Add a new service to the list at `config/tools.json` by copying the existing tool format.
2. Your new service should be feature flagged off while it is being built by setting `enabled: false`. You will still be able to run it via a developer shortcut (see below.)
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
13. When your service is set to `enabled: true`, it will be triggered by the main service.

FIXME (Step 4 & 5) Can we use a prefix or place all services in a 'services' folder so lerna can pick them up?

FIXME (Step 4) Can we avoid step 4 and get the install for free if we are using a prefix like `packages/services-*`?

FIXME (Step 4) If we remove sub-packages do we only need to install at the root?

FIXME (Step 7) Can we automatically map the source code in `dev.bat`/`dev.sh` if we are using `packages/services-*`?

## Notes

- To build and test your tool while keeping it hidden from the customer, `build:dev` generates additional shortcuts to every individual service, regardless if whether they are enabled or not.
- `main-service` is triggered via the "Run SPM UI Upgrade Helper" shortcut. It will trigger all enabled tools.
- When the Docker container starts, the `code-generation` package uses the data in `config/tools.json` to generate a `server.js` file for each package. It also generates Eclipse Theia plugins as `packages/vs-upgrade-helper-plugin/src/functions.ts`.
- Flagging the features off during development means you can can continue to commit to `main` every day. This means no long-lived feature branches which means no painful merges, and if your branch breaks something you find out today.
