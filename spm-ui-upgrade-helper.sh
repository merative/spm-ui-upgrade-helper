#!/usr/bin/sh

ERROR=
if [[ -z "$1" ]]; then
  echo ERROR: Missing version argument
  ERROR=true
fi
if [[ -z "$2" ]]; then
  echo ERROR: Missing input folder argument
  ERROR=true
fi
if [[ -z "$3" ]]; then
  echo ERROR: Missing output folder argument
  ERROR=true
fi
if [[ -n "$ERROR" ]]; then
    echo Usage: ./spm-ui-upgrade-helper.sh \<version\> \<input folder\> \<output folder\>
    exit 1
fi

VERSION=$1
INPUT_FOLDER_CMD="-v $2:/home/workspace/input"
OUTPUT_FOLDER_CMD="-v $3:/home/workspace/output"

if [[ "$DETACH" == "true" ]]; then
  DETACH_CMD=--detach
else
  DETACH_CMD=
fi

echo Starting spm-ui-upgrade-helper
echo
echo     VERSION = $VERSION
echo     INPUT_FOLDER_CMD = $INPUT_FOLDER_CMD
echo     OUTPUT_FOLDER_CMD = $OUTPUT_FOLDER_CMD
echo     DETACH_CMD = $DETACH_CMD
echo

docker-compose stop  beanparser
docker-compose down  beanparser
docker-compose stop  nodefront
docker-compose down  nodefront
docker-compose stop upgradehelper
docker-compose rm -f upgradehelper

echo Logging in to Docker Hub...
docker login
if [ "$?" != 0 ]; then echo "Error: Could not log in to Docker repo."; exit 1; fi
docker pull ibmcom/spm-ui-upgrade-beanparser:latest
if [ "$?" != 0 ]; then echo "Error: Could not pull $VERSION version."; exit 1; fi
docker pull ibmcom/spm-ui-upgrade-nodefront:latest
if [ "$?" != 0 ]; then echo "Error: Could not pull $VERSION version."; exit 1; fi
docker pull ibmcom/spm-ui-upgrade-upgradehelper:latest
if [ "$?" != 0 ]; then echo "Error: Could not pull $VERSION version."; exit 1; fi
docker-compose run $DETACH_CMD -p 3000:3000 -p 4000:4000 \
    $UIUH_DEV_CMD \
    $INPUT_FOLDER_CMD \
    $OUTPUT_FOLDER_CMD \
    --name spm-ui-upgrade-helper_upgradehelper \
    ibmcom/spm-ui-upgrade-helper:latest
if [ "$?" != 0 ]; then echo "Error: Could not run $VERSION version."; exit 1; fi



