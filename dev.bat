@echo off
setlocal

:: This is for mapping local development code onto the docker image so you can watch for changes
if "%UIUH_DEV%"=="true" (
  set UIUH_DEV_CMD=-v C:\git\spm-ui-upgrade-helper\packages\css-rules-engine:/home/theia/packages/css-rules-engine/ -v C:\git\spm-ui-upgrade-helper\packages\icon-replacer:/home/theia/packages/icon-replacer/ -v C:\git\spm-ui-upgrade-helper\packages\js-rules-engine:/home/theia/packages/js-rules-engine/ -v C:\git\spm-ui-upgrade-helper\packages\shared-utils:/home/theia/packages/shared-utils/ -v C:\git\spm-ui-upgrade-helper\config:/home/theia/config/
  echo Dev Mode On
) else (
  set UIUH_DEV_CMD=
  echo Dev Mode Off ^(use set UIUH_DEV=true to turn it on^)
)

if "%INPUT_FOLDER%" == "" (
  set INPUT_FOLDER=C:\git\spm-ui-upgrade-helper\workspace\input
)
if "%OUTPUT_FOLDER%" == "" (
  set OUTPUT_FOLDER=C:\git\spm-ui-upgrade-helper\workspace\output
)
if "%ADDITIONAL_RULES%" == "" (
  set ADDITIONAL_RULES=C:\git\spm-ui-upgrade-helper\workspace\rules
)
if "%ADDITIONAL_IGNORE%" == "" (
  set ADDITIONAL_IGNORE=C:\git\spm-ui-upgrade-helper\workspace\ignore
)

call spm-ui-upgrade-helper.bat %INPUT_FOLDER% %OUTPUT_FOLDER% %ADDITIONAL_RULES% %ADDITIONAL_IGNORE%

endlocal
