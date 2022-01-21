#!/usr/bin/sh

ERROR=
if [[ -z "$VERSION" ]]; then
  echo ERROR: Missing version argument
  ERROR=true
fi
if [[ -z "$INPUT_FOLDER" ]]; then
  echo ERROR: Missing input folder argument
  ERROR=true
fi
if [[ -z "$OUTPUT_FOLDER" ]]; then
  echo ERROR: Missing output folder argument
  ERROR=true
fi
if [[ -z "$INPUT_FOLDER/EJBServer/build" ]]; then
  echo ERROR: The ServerAccessBean path is missing. Build the server or the model to generate EJBserver/build, e.g. serverbuild.model
  ERROR=true
fi
if [[ -n "$ERROR" ]]; then
    echo Usage: error
    exit 1
fi

if [[ "$DETACH" == "true" ]]; then
  DETACH_CMD=--detach
else
  DETACH_CMD=
fi

echo Starting spm-ui-upgrade-helper
echo
echo     VERSION = $VERSION
echo     INPUT_FOLDER = $INPUT_FOLDER
echo     OUTPUT_FOLDER = $OUTPUT_FOLDER
echo     DETACH_CMD = $DETACH_CMD
echo     

docker-compose rm -v -s -f

echo Logging in to Docker Hub...
docker login
if [ "$?" != 0 ]; then echo "Error: Could not log in to Docker repo."; exit 1; fi
docker pull whgovspm/spm-ui-upgrade-helper:$VERSION 
docker tag whgovspm/spm-ui-upgrade-helper:$VERSION spm-ui-upgrade-helper
docker pull whgovspm/spm-ui-upgrade-helper_nodefront:$VERSION
docker tag whgovspm/spm-ui-upgrade-helper_nodefront:$VERSION spm-ui-upgrade-helper_nodefront
docker pull whgovspm/spm-ui-upgrade-helper_beanparser:$VERSION
docker tag whgovspm/spm-ui-upgrade-helper_beanparser:$VERSION spm-ui-upgrade-helper_beanparser
docker image rm -f whgovspm/spm-ui-upgrade-helper_beanparser:$VERSION
docker image rm -f whgovspm/spm-ui-upgrade-helper_nodefront:$VERSION
docker image rm -f whgovspm/spm-ui-upgrade-helper:$VERSION

docker-compose up $DETACH_CMD --no-build 

if [ "$?" != 0 ]; then echo "Error: Could not run $VERSION version."; exit 1; fi

