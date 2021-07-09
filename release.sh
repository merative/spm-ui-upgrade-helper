#!/usr/bin/sh

echo ==== release.sh ====

version=`git tag --points-at HEAD`
if [ -z $version ]; then echo "No version tag found."; exit 0; fi
echo found tag = $version

yarn install
if [ "$?" != 0 ]; then echo "Build Failed"; exit 1; fi

yarn generate-files
if [ "$?" != 0 ]; then echo "Build Failed"; exit 1; fi

yarn docker-tasks build
if [ "$?" != 0 ]; then echo "Build Failed"; exit 1; fi

docker login wh-govspm-docker-local.artifactory.swg-devops.com -u $IBM_DOCKER_USERNAME -p $IBM_DOCKER_PASSWORD
if [ "$?" != 0 ]; then echo "Build Failed"; exit 1; fi

yarn docker-tasks release $version -n
if [ "$?" != 0 ]; then echo "Build Failed"; exit 1; fi
#docker image tag spm-ui-upgrade-helper:latest spm-ui-upgrade-helper:0.0.0
#docker image tag spm-ui-upgrade-helper:latest wh-govspm-docker-local.artifactory.swg-devops.com/artifactory/wh-govspm-docker-local/spm-ui-upgrade-helper/spm-ui-upgrade-helper:0.0.0
#docker image tag spm-ui-upgrade-helper:latest wh-govspm-docker-local.artifactory.swg-devops.com/artifactory/wh-govspm-docker-local/spm-ui-upgrade-helper/spm-ui-upgrade-helper:latest
#docker image push wh-govspm-docker-local.artifactory.swg-devops.com/artifactory/wh-govspm-docker-local/spm-ui-upgrade-helper/spm-ui-upgrade-helper:0.0.0
#docker image push wh-govspm-docker-local.artifactory.swg-devops.com/artifactory/wh-govspm-docker-local/spm-ui-upgrade-helper/spm-ui-upgrade-helper:latest

echo "All done!"
