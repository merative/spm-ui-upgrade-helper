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

if "%4" == "" (
  set ADDITIONAL_RULES_CMD=
) else (
  set ADDITIONAL_RULES_CMD=-v %4:/home/workspace/rules
)
if "%5" == "" (
  set ADDITIONAL_IGNORE_CMD=
) else (
  set ADDITIONAL_IGNORE_CMD=-v %5:/home/workspace/ignore
)

:: Detach by default
if "%DETACH%" == "false" (
  set DETACH_CMD=
) else (
  set DETACH_CMD=--detach
)

echo Starting spm-ui-upgrade-helper
echo.
echo     VERSION = %VERSION%
echo     INPUT_FOLDER_CMD = %INPUT_FOLDER_CMD%
echo     OUTPUT_FOLDER_CMD = %OUTPUT_FOLDER_CMD%
echo     ADDITIONAL_RULES_CMD = %ADDITIONAL_RULES_CMD%
echo     ADDITIONAL_IGNORE_CMD = %ADDITIONAL_IGNORE_CMD%
echo     DETACH_CMD = %DETACH_CMD%
echo.

call docker stop spm-ui-upgrade-helper
call docker rm spm-ui-upgrade-helper
echo Logging in to wh-govspm-docker-local.artifactory.swg-devops.com...
call docker login wh-govspm-docker-local.artifactory.swg-devops.com
call docker pull wh-govspm-docker-local.artifactory.swg-devops.com/artifactory/wh-govspm-docker-local/spm-ui-upgrade-helper/spm-ui-upgrade-helper:%VERSION%
call docker run %DETACH_CMD% -p 3000:3000 -p 4000-4002:4000-4002 %UIUH_DEV_CMD% %INPUT_FOLDER_CMD% %OUTPUT_FOLDER_CMD% %ADDITIONAL_RULES_CMD% %ADDITIONAL_IGNORE_CMD% --name spm-ui-upgrade-helper wh-govspm-docker-local.artifactory.swg-devops.com/artifactory/wh-govspm-docker-local/spm-ui-upgrade-helper/spm-ui-upgrade-helper:%VERSION%
call docker ps
endlocal

goto end

:printHelpAndExit
echo Usage: spm-ui-upgrade-helper.bat ^<version^> ^<input folder^> ^<output folder^> [^<additional rules^>] [^<additional ignore^>]
exit /B 1

:end
