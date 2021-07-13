[<< Back to the developer guide](../developer_guide.md)

# Releasing

1. Run `yarn release --start 0.0.1` to create the release branch
    - This will create a branch named `v0.0.1`, push it to Travis, and build a Docker image
2. Release hardening
    - Acceptance test the branch
    - Use `yarn at:build` and then `at.bat`/`at.sh` to generate and test against example data
    - If issues are found, the correct process is to fix them on `main` and cherry-pick the fixes into the `v0.0.1` branch
3. Run `yarn release --ship 0.0.1`
    - This will push the latest image to Docker as `imageName:0.0.1` and `imageName:latest`, then tag the branch as `v0.0.1`

## Notes

- This process has to be run locally due to a bug when building the Docker image in Travis.
- Release branches such as `v0.0.1` are never merged back into `main`. If issues are found then the correct process is to fix them on `main` and cherry-pick the fixes into the `v0.0.1` branch. This reduces the risk of regression caused by forgetting to merge or merging incorrectly.
- Ideally the step 2 acceptance testing should be 100% automated.
- Uploading to Docker takes around 40 minutes.
- We upload to the Docker repo `wh-govspm-docker-local.artifactory.swg-devops.com`. Note that this is not the SPM DevOps Docker repo. It is a GovHHS Docker repo.
- If you are getting authentication failures when shipping use `docker login wh-govspm-docker-local.artifactory.swg-devops.com` and log in with your W3 credentials.
