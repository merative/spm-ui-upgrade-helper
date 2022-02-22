export INPUT_FOLDER=$PWD/packages/acceptance-tests/input
export OUTPUT_FOLDER=$PWD/packages/acceptance-tests/output

yarn build:release
sh dev.sh

