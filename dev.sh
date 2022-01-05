#!/usr/bin/sh

# This is for mapping local development code onto the docker image so you can watch for changes
if [[ "$UIUH_DEV" == "true" ]]; then
  UIUH_DEV_CMD="-v $PWD/packages/main-tool:/home/theia/packages/main-tool/ \
      -v $PWD/packages/css-rules-tool:/home/theia/packages/css-rules-tool/ \
      -v $PWD/packages/icon-replacer-tool:/home/theia/packages/icon-replacer-tool/ \
      -v $PWD/packages/js-rules-tool:/home/theia/packages/js-rules-tool/ \
      -v $PWD/packages/shared-utils:/home/theia/packages/shared-utils/ \
      -v $PWD/packages/window-size-tool:/home/theia/packages/window-size-tool/ \
      -v $PWD/config:/home/theia/config/"
  echo Dev Mode On
else
  UIUH_DEV_CMD=
  echo "Dev Mode Off (use export UIUH_DEV=true to turn it on)"
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

echo Starting spm-ui-upgrade-helper
echo
echo     VERSION = $VERSION
echo     INPUT_FOLDER_CMD = $INPUT_FOLDER
echo     OUTPUT_FOLDER_CMD = $OUTPUT_FOLDER
echo

docker-compose rm -f -s -v 

docker-compose run -p 3000:3000 -p 4000-4004:4000-4004  $UIUH_DEV_CMD --name spm-ui-upgrade-helper spm-ui-upgrade-helper
echo Docker run