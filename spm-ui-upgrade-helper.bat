@echo off
setlocal

set ERROR=
if "%1" == "" (
  echo ERROR: Missing version argument
  set ERROR=true
)
if "%2" == "" (
  echo ERROR: Missing input folder argument
  set ERROR=true
)
if "%3" == "" (
  echo ERROR: Missing output folder argument
  set ERROR=true
)
if not "%ERROR%"=="" (
  goto printHelpAndExit
)

set VERSION=%1
set INPUT_FOLDER_CMD=-v %2:/home/workspace/input
set OUTPUT_FOLDER_CMD=-v %3:/home/workspace/output

:: Attach by default
if "%DETACH%" == "true" (
  set DETACH_CMD=--detach
) else (
  set DETACH_CMD=
)

echo Starting spm-ui-upgrade-helper
echo.
echo     VERSION = %VERSION%
echo     INPUT_FOLDER_CMD = %INPUT_FOLDER_CMD%
echo     OUTPUT_FOLDER_CMD = %OUTPUT_FOLDER_CMD%
echo     DETACH_CMD = %DETACH_CMD%
echo.

call docker-compose stop  parser_beanparser
call docker-compose down  parser_beanparser
call docker-compose stop  parser_nodefront
call docker-compose down  parser_nodefront
call docker-compose stop spm-ui-upgrade-helper
call docker-compose rm -f spm-ui-upgrade-helper
echo Logging in to Docker Hub...
call docker login
call docker pull ibmcom/spm-ui-upgrade-helper:%VERSION%
call docker tag ibmcom/spm-ui-upgrade-helper:$VERSION  spm-ui-upgrade-helper:$VERSION 
call docker-compose run $DETACH_CMD -p 3000:3000 -p 4000:4000 \
    $UIUH_DEV_CMD \
    $INPUT_FOLDER_CMD \
    $OUTPUT_FOLDER_CMD \
    --name spm-ui-upgrade-helper \
    spm-ui-upgrade-helper

endlocal

goto end
:printHelpAndExit
echo Usage: spm-ui-upgrade-helper.bat ^<version^> ^<input folder^> ^<output folder^>
exit /B 1

:end
