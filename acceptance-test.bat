@echo off
set INPUT_FOLDER=%CD%\packages\acceptance-tests\input
set OUTPUT_FOLDER=%CD%\packages\acceptance-tests\output

yarn build:release
call dev.bat
