@echo off
setlocal

:: This is for mapping local development code onto the docker image so you can watch for changes
if "%UIUH_DEV%"=="true" (
  set UIUH_DEV2=-v C:\git\spm-ui-upgrade-helper\packages\css-rules-engine:/home/theia/packages/css-rules-engine/ -v C:\git\spm-ui-upgrade-helper\packages\icon-replacement:/home/theia/packages/icon-replacement/ -v C:\git\spm-ui-upgrade-helper\packages\js-rules-engine:/home/theia/packages/js-rules-engine/ -v C:\git\spm-ui-upgrade-helper\packages\shared-utils:/home/theia/packages/shared-utils/ -v C:\git\spm-ui-upgrade-helper\config:/home/theia/config/
  echo Dev Mode On
) else (
  set UIUH_DEV2=
  echo Dev Mode Off (use set UIUH_DEV=true to turn it on)
)

call docker stop ui-upgrade-helper
call docker rm ui-upgrade-helper

set INPUT_FOLDER=C:\git\spm-ui-upgrade-helper\workspace\input
set OUTPUT_FOLDER=C:\git\spm-ui-upgrade-helper\workspace\output
set ADDITIONAL_RULES=C:\git\spm-ui-upgrade-helper\workspace\rules
set ADDITIONAL_IGNORE=C:\git\spm-ui-upgrade-helper\workspace\ignore

call docker run -p 3000:3000 -p 4000-4002:4000-4002 %UIUH_DEV2% -v %INPUT_FOLDER%:/home/workspace/input -v %OUTPUT_FOLDER%:/home/workspace/output -v %ADDITIONAL_RULES%:/home/workspace/rules -v %ADDITIONAL_IGNORE%:/home/workspace/ignore --name ui-upgrade-helper ui-upgrade-helper:latest

endlocal
