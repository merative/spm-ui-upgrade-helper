@echo off
setlocal

:: This is for mapping local development code onto the docker image so you can watch for changes
if "%UIUH_DEV%"=="true" (
  set UIUH_DEV_CMD=-v C:\git\spm-ui-upgrade-helper\packages\main-tool:/home/theia/packages/main-tool/ ^
      -v C:\git\spm-ui-upgrade-helper\packages\css-rules-tool:/home/theia/packages/css-rules-tool/ ^
      -v C:\git\spm-ui-upgrade-helper\packages\icon-replacer-tool:/home/theia/packages/icon-replacer-tool/ ^
      -v C:\git\spm-ui-upgrade-helper\packages\js-rules-tool:/home/theia/packages/js-rules-tool/ ^
      -v C:\git\spm-ui-upgrade-helper\packages\shared-utils:/home/theia/packages/shared-utils/ ^
      -v C:\git\spm-ui-upgrade-helper\packages\window-size-tool:/home/theia/packages/window-size-tool/ ^
      -v C:\git\spm-ui-upgrade-helper\config:/home/theia/config/
  echo Dev Mode On
) else (
  set UIUH_DEV_CMD=
  echo Dev Mode Off ^(use set UIUH_DEV=true to turn it on^)
)

if "%VERSION%" == "" (
  set VERSION=latest
)
if "%INPUT_FOLDER%" == "" (
  set INPUT_FOLDER=C:\git\spm-ui-upgrade-helper\workspace\input
)
if "%OUTPUT_FOLDER%" == "" (
  set OUTPUT_FOLDER=C:\git\spm-ui-upgrade-helper\workspace\output
)

echo Starting spm-ui-upgrade-helper
echo.
echo     VERSION = %VERSION%
echo     INPUT_FOLDER = %INPUT_FOLDER%
echo     OUTPUT_FOLDER= %OUTPUT_FOLDER_CMD%
echo.

call docker-compose rm -f -s -v 

call docker-compose up --no-build 

endlocal