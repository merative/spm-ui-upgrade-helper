@echo off
setlocal

set ERROR=
if "%1" == "" (
  echo ERROR: Missing input folder argument
  set ERROR=true
)
if "%2" == "" (
  echo ERROR: Missing output folder argument
  set ERROR=true
)
if not "%ERROR%"=="" (
  goto printHelpAndExit
)

set INPUT_FOLDER=%1
set OUTPUT_FOLDER=%2

if "%ADDITIONAL_RULES%" == "" (
  set ADDITIONAL_RULES_CMD=
) else (
  set ADDITIONAL_RULES_CMD=-v %ADDITIONAL_RULES%:/home/workspace/rules
)
if "%ADDITIONAL_IGNORE%" == "" (
  set ADDITIONAL_IGNORE_CMD=
) else (
  set ADDITIONAL_IGNORE_CMD=-v %ADDITIONAL_IGNORE%:/home/workspace/ignore
)

echo starting spm-ui-upgrade-helper
echo.
echo     INPUT_FOLDER = %INPUT_FOLDER%
echo     OUTPUT_FOLDER = %OUTPUT_FOLDER%
echo     ADDITIONAL_RULES = %ADDITIONAL_RULES%
echo     ADDITIONAL_IGNORE = %ADDITIONAL_IGNORE%
echo.

call docker stop spm-ui-upgrade-helper
call docker rm spm-ui-upgrade-helper
call docker run -p 3000:3000 -p 4000-4002:4000-4002 -v %INPUT_FOLDER%:/home/workspace/input -v %OUTPUT_FOLDER%:/home/workspace/output %ADDITIONAL_RULES_CMD% %ADDITIONAL_IGNORE_CMD% --name ui-upgrade-helper wh-govspm-docker-local.artifactory.swg-devops.com/artifactory/wh-govspm-docker-local/spm-ui-upgrade-helper/spm-ui-upgrade-helper:latest

endlocal

goto end

:printHelpAndExit
echo Usage: spm-ui-upgrade-helper.bat ^<input folder^> ^<output folder^>
exit /B 1

:end
