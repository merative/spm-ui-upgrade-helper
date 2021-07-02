@echo off
setlocal

::set INPUT_FOLDER=C:\git\spm-ui-upgrade-helper\workspace\input
::set OUTPUT_FOLDER=C:\git\spm-ui-upgrade-helper\workspace\output

if "%1" == "" (
  echo ERROR: Missing input folder argument
  goto printHelpAndExit
  exit /B 1
)
if "%2" == "" (
  echo ERROR: Missing output folder argument
  goto printHelpAndExit
  exit /B 1
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

call docker stop ui-upgrade-helper
call docker rm ui-upgrade-helper
call docker run -p 3000:3000 -p 4000-4002:4000-4002 -v %INPUT_FOLDER%:/home/workspace/input -v %OUTPUT_FOLDER%:/home/workspace/output %ADDITIONAL_RULES_CMD% %ADDITIONAL_IGNORE_CMD% --name ui-upgrade-helper wh-govspm-docker-local.artifactory.swg-devops.com/artifactory/wh-govspm-docker-local/ui-upgrade-helper/ui-upgrade-helper:latest

endlocal

goto end

:printHelpAndExit
echo Usage: customer.bat <input folder> <output folder>

:end
