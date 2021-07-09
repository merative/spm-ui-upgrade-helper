[<< Back to the developer guide](../developer_guide.md)

# Releasing

1. Create the release branch

    - `git checkout -b v0.0.1`
    - `git push --set-upstream origin v0.0.1`

2. Release hardening stage

   - Acceptance test the branch
   - If issues are found, the correct process is to fix them on `main` and cherry-pick the fixes into the `v0.0.1` branch

3. Ship it

   - `git tag v0.0.1`
   - `git push --tags`
   - Travis will see the tag and will automatically build the commit, build the image, and upload it to docker

## Notes

- Release branches such as `v0.0.1` are never merged back into `main`. If issues are found then the correct process is to fix them on `main` and cherry-pick the fixes into the `v0.0.1` branch. This reduces the risk of regression caused by forgetting to merge or merging incorrectly.
- Release branches and tags must begin with a 'v'.
- Ideally the step 2 acceptance testing is 100% automated.
- Uploading to docker takes around 40 minutes.
- You can see the build status at https://app.travis-ci.com/github/IBM/spm-ui-upgrade-helper/builds
- We upload to the docker repo `wh-govspm-docker-local.artifactory.swg-devops.com`. Note that this is not the SPM DevOps docker repo. It is a GovHHS docker repo.
- Travis has two variables `IBM_DOCKER_USERNAME` and `IBM_DOCKER_PASSWORD` used to log in to `wh-govspm-docker-local.artifactory.swg-devops.com`. You can edit these variables at https://app.travis-ci.com/github/IBM/spm-ui-upgrade-helper/settings. You can test other credentials in the terminal using `docker login wh-govspm-docker-local.artifactory.swg-devops.com`.

