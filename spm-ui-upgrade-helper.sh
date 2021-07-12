#!/usr/bin/sh

ERROR=
if [[ -z "$1" ]]; then
  echo ERROR: Missing input folder argument
  ERROR=true
fi
if [[ -z "$2" ]]; then
  echo ERROR: Missing output folder argument
  ERROR=true
fi
if [[ -n "$ERROR" ]]; then
    echo Usage: spm-ui-upgrade-helper.bat \<input folder\> \<output folder\> [\<additional rules\>] [\<additional ignore\>]
    exit 1
fi

INPUT_FOLDER=$1
OUTPUT_FOLDER=$2

if [[ -z "$3" ]]; then
  ADDITIONAL_RULES_CMD=
else
  ADDITIONAL_RULES_CMD="-v $ADDITIONAL_RULES:/home/workspace/rules"
fi
if [[ -z "$4" ]]; then
  ADDITIONAL_IGNORE_CMD=
else
  ADDITIONAL_IGNORE_CMD="-v $ADDITIONAL_IGNORE:/home/workspace/ignore"
fi

echo Starting spm-ui-upgrade-helper
echo
echo     INPUT_FOLDER = $INPUT_FOLDER
echo     OUTPUT_FOLDER = $OUTPUT_FOLDER
echo     ADDITIONAL_RULES = $ADDITIONAL_RULES
echo     ADDITIONAL_IGNORE = $ADDITIONAL_IGNORE
echo

docker stop spm-ui-upgrade-helper
docker rm spm-ui-upgrade-helper
docker login wh-govspm-docker-local.artifactory.swg-devops.com
if [ "$?" != 0 ]; then echo "Error: Could not log in to Docker repo."; exit 1; fi
docker pull wh-govspm-docker-local.artifactory.swg-devops.com/artifactory/wh-govspm-docker-local/spm-ui-upgrade-helper/spm-ui-upgrade-helper:latest
if [ "$?" != 0 ]; then echo "Error: Could not pull latest version."; exit 1; fi
docker run -p 3000:3000 -p 4000-4002:4000-4002 $UIUH_DEV_CMD -v $INPUT_FOLDER:/home/workspace/input -v $OUTPUT_FOLDER:/home/workspace/output $ADDITIONAL_RULES_CMD $ADDITIONAL_IGNORE_CMD --name spm-ui-upgrade-helper wh-govspm-docker-local.artifactory.swg-devops.com/artifactory/wh-govspm-docker-local/spm-ui-upgrade-helper/spm-ui-upgrade-helper:latest
