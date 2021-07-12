#!/usr/bin/sh

# This is for mapping local development code onto the docker image so you can watch for changes
if [[ "$UIUH_DEV" == "true" ]]; then
  UIUH_DEV_CMD=-v $PWD/packages/css-rules-engine:/home/theia/packages/css-rules-engine/ \
      -v $PWD/packages/icon-replacer:/home/theia/packages/icon-replacer/ \
      -v $PWD/packages/js-rules-engine:/home/theia/packages/js-rules-engine/ \
      -v $PWD/packages/shared-utils:/home/theia/packages/shared-utils/ \
      -v $PWD/config:/home/theia/config/
  echo Dev Mode On
else
  UIUH_DEV_CMD=
  echo Dev Mode Off (use set UIUH_DEV=true to turn it on)
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
if "%ADDITIONAL_IGNORE%" == "" (
  ADDITIONAL_IGNORE=$PWD/workspace/ignore
fi

./spm-ui-upgrade-helper.sh $INPUT_FOLDER $OUTPUT_FOLDER $ADDITIONAL_RULES $ADDITIONAL_IGNORE
