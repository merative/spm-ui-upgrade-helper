#!/usr/bin/sh

# This is for mapping local development code onto the docker image so you can watch for changes
if [[ "$UIUH_DEV" == "true" ]]; then
  UIUH_DEV_CMD=-v $PWD/packages/service-main:/home/theia/packages/service-main/ \
      -v $PWD/packages/css-rules-engine:/home/theia/packages/css-rules-engine/ \
      -v $PWD/packages/icon-replacer:/home/theia/packages/icon-replacer/ \
      -v $PWD/packages/js-rules-engine:/home/theia/packages/js-rules-engine/ \
      -v $PWD/packages/shared-utils:/home/theia/packages/shared-utils/ \
      -v $PWD/config:/home/theia/config/
  echo Dev Mode On
else
  UIUH_DEV_CMD=
  echo Dev Mode Off (use export UIUH_DEV=true to turn it on)
fi

if [[ -z "$VERSION" ]]; then
  VERSION=latest
fi
if [[ -z "$INPUT_FOLDER" ]]; then
  INPUT_FOLDER=$PWD/workspace/input
fi
if [[ -z "$OUTPUT_FOLDER" ]]; then
  OUTPUT_FOLDER=$PWD/workspace/output
fi
if [[ -z "$ADDITIONAL_RULES" ]]; then
  ADDITIONAL_RULES=$PWD/workspace/rules
fi
if [[ -z "$ADDITIONAL_IGNORE" ]]; then
  ADDITIONAL_IGNORE=$PWD/workspace/ignore
fi

INPUT_FOLDER_CMD="-v $INPUT_FOLDER:/home/workspace/input"
OUTPUT_FOLDER_CMD="-v $OUTPUT_FOLDER:/home/workspace/output"
ADDITIONAL_RULES_CMD="-v $ADDITIONAL_RULES:/home/workspace/rules"
ADDITIONAL_IGNORE_CMD="-v $ADDITIONAL_IGNORE:/home/workspace/ignore"

echo Starting spm-ui-upgrade-helper
echo
echo     VERSION = $VERSION
echo     INPUT_FOLDER_CMD = $INPUT_FOLDER_CMD
echo     OUTPUT_FOLDER_CMD = $OUTPUT_FOLDER_CMD
echo     ADDITIONAL_RULES_CMD = $ADDITIONAL_RULES_CMD
echo     ADDITIONAL_IGNORE_CMD = $ADDITIONAL_IGNORE_CMD
echo

docker stop spm-ui-upgrade-helper
docker rm spm-ui-upgrade-helper
docker run -p 3000:3000 -p 4000-4002:4000-4002 $UIUH_DEV_CMD $INPUT_FOLDER_CMD $OUTPUT_FOLDER_CMD $ADDITIONAL_RULES_CMD $ADDITIONAL_IGNORE_CMD --name spm-ui-upgrade-helper spm-ui-upgrade-helper:$VERSION
