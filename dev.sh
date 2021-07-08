#!/usr/bin/sh

DEV_FOLDERS=-v /Users/jonathan/Code/spm-ui-upgrade-helper/packages/css-rules-engine:/home/theia/packages/css-rules-engine/ -v /Users/jonathan/Code/spm-ui-upgrade-helper/packages/icon-replacer:/home/theia/packages/icon-replacer/ -v /Users/jonathan/Code/spm-ui-upgrade-helper/packages/js-rules-engine:/home/theia/packages/js-rules-engine/ -v /Users/jonathan/Code/spm-ui-upgrade-helper/packages/shared-utils:/home/theia/packages/shared-utils/ -v /Users/jonathan/Code/spm-ui-upgrade-helper/config:/home/theia/config/

docker stop spm-ui-upgrade-helper
docker rm spm-ui-upgrade-helper

INPUT_FOLDER=/Users/jonathan/Desktop/ui-upgrade-helper/input
OUTPUT_FOLDER=/Users/jonathan/Desktop/ui-upgrade-helper/output

docker run -d -p 3000:3000 -p 4000-4002:4000-4002 $DEV_FOLDERS -v $INPUT_FOLDER:/home/workspace/input -v $OUTPUT_FOLDER:/home/workspace/output --name spm-ui-upgrade-helper spm-ui-upgrade-helper:latest
