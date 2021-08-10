---
title: Releasing
---

1. Start the release process
    - Run `yarn release --start 0.0.1`
        - This will run the tests, build the Docker image, create a release branch named `v0.0.1` and push it to GitHub
2. Release testing
    - Run `yarn at:install` to install Puppeteer
    - Run `yarn at:generate-data kitchen-sink` to generate acceptance test data
    - Run `acceptance-test.bat`/`acceptance-test.sh` to point the tool at the generated data
    - Run `yarn at:test` to run Puppeteer tests against the generated data, or run the tool manually
    - If issues are found when testing:
        - Reproduce the issues on `main` and fix them there
        - Cherry-pick the fixes into the `v0.0.1` branch
        - Re-run `yarn build:release`
3. Ship the release
    - Run `yarn release --ship`
        - This will push the image to the Docker Hub as `<image name>:0.0.1` and `<image name>:latest`, tag the commit as `v0.0.1` and push the tag to GitHub

## Notes

- Release branches such as `v0.0.1` are never merged back into `main`. If issues are found then the correct process is to fix the issues on `main` and cherry-pick the fixes into the `v0.0.1` branch. This reduces the risk of regression caused by forgetting to merge or merging incorrectly.
- We upload to the Docker Hub here: https://hub.docker.com/repository/docker/ibmcom/spm-ui-upgrade-helper
- Creating the release will create a `version.json` file with the version number, and building the image will create a `commit.json` file with the commit hash the release was built from. These will be included in the Docker image and can be used to help triage customer issues. This is why it is important to re-run `yarn build:release` every time the release branch changes, so that `commit.json` is accurate.
