#!/bin/sh

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

docker-compose stop  parser_beanparser
docker-compose down  parser_beanparser
docker-compose stop  parser_nodefront
docker-compose down  parser_nodefront
docker-compose stop spm-ui-upgrade-helper
docker-compose rm -f spm-ui-upgrade-helper
docker image rm ibmcom/spm-ui-upgrade-helper

echo Logging in to Docker Hub...
docker login
if [ "$?" != 0 ]; then echo "Error: Could not log in to Docker repo."; exit 1; fi
docker-compose pull whgovspm/spm-ui-upgrade-helper:$VERSION
docker tag whgovspm/spm-ui-upgrade-helper:$VERSION spm-ui-upgrade-helper:$VERSION 
# docker pull whgovspm/spm-ui-upgrade-helper_nodefront:$VERSION
# docker tag whgovspm/spm-ui-upgrade-helper_nodefront:$VERSION spm-ui-upgrade-helper_nodefron:$VERSION 
# docker pull whgovspm/spm-ui-upgrade-helper_beanparser:$VERSION
# docker tag whgovspm/spm-ui-upgrade-helper_beanparser:$VERSION whgovspm/spm-ui-upgrade-helper_beanparser:$VERSION 
docker-compose build 
docker-compose run $DETACH_CMD -p 3000:3000 -p 4000:4000 \
    $UIUH_DEV_CMD \
    $INPUT_FOLDER_CMD \
    $OUTPUT_FOLDER_CMD \
    --name spm-ui-upgrade-helper \
    spm-ui-upgrade-helper
if [ "$?" != 0 ]; then echo "Error: Could not run $VERSION version."; exit 1; fi

