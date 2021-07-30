[<< Back to the developer guide](../developer_guide.md)

# Releasing

1. Run `yarn release --start 0.0.1` to create the release branch
    - This will create a branch named `v0.0.1`, push it to Travis, and build a Docker image
2. Release hardening
    - Use `yarn at:build kitchen-sink` to generate acceptance test data
    - Use `at.bat`/`at.sh` to point the tool at the generated data
    - Use `yarn at:test` to run puppeteer tests against the generated data
    - If issues are found, the correct process is to fix the issues on `main` and cherry-pick the fixes into the `v0.0.1` branch
3. Run `yarn release --ship 0.0.1`
    - This will push the latest image to Docker as `imageName:0.0.1` and `imageName:latest`, then tag the branch as `v0.0.1`

## Notes

- This process has to be run locally due to a bug when building the Docker image in Travis.
- Release branches such as `v0.0.1` are never merged back into `main`. If issues are found then the correct process is to fix the issues on `main` and cherry-pick the fixes into the `v0.0.1` branch. This reduces the risk of regression caused by forgetting to merge or merging incorrectly.
- Uploading to Docker takes around 20 minutes total.
- We upload to the Docker repo `wh-govspm-docker-local.artifactory.swg-devops.com`. Note that this is not the SPM DevOps Docker repo. It is a GovHHS Docker repo.
- If you are getting authentication failures when shipping use `docker login wh-govspm-docker-local.artifactory.swg-devops.com` and log in with your W3 credentials.
- We also upload to the public https://hub.docker.com/repository/docker/ibmcom/spm-ui-upgrade-helper repo.
