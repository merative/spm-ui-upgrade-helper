@echo off
setlocal

set ERROR=
if "%VERSION%" == "" (
  echo ERROR: Missing version argument
  set ERROR=true
)
if "%INPUT_FOLDER%" == "" (
  echo ERROR: Missing input folder argument
  set ERROR=true
)
if "%OUTPUT_FOLDER%" == "" (
  echo ERROR: Missing output folder argument
  set ERROR=true
)
if "%SERVER_DIR%" == "" (
  echo ERROR: Missing path to ServerAccessBean
  set ERROR=true
)
if not "%ERROR%"=="" (
  goto printHelpAndExit
)

:: Attach by default
if "%DETACH%" == "true" (
  set DETACH_CMD=--detach
) else (
  set DETACH_CMD=
)

echo Starting spm-ui-upgrade-helper
echo.
echo     VERSION = %VERSION%
echo     INPUT_FOLDER = %INPUT_FOLDER%
echo     OUTPUT_FOLDER = %OUTPUT_FOLDER%
echo     DETACH_CMD = %DETACH_CMD%
echo.

call docker-compose rm -v -s -f
echo Logging in to Docker Hub...
call docker login
call docker pull whgovspm/spm-ui-upgrade-helper:%VERSION%
call docker tag whgovspm/spm-ui-upgrade-helper:%VERSION% spm-ui-upgrade-helper
call docker pull whgovspm/spm-ui-upgrade-helper_nodefront:%VERSION%
call docker tag whgovspm/spm-ui-upgrade-helper_nodefront:%VERSION% spm-ui-upgrade-helper_nodefront
call docker pull whgovspm/spm-ui-upgrade-helper_beanparser:%VERSION%
call docker tag whgovspm/spm-ui-upgrade-helper_beanparser:%VERSION% spm-ui-upgrade-helper_beanparser
call docker image rm -f whgovspm/spm-ui-upgrade-helper_beanparser:%VERSION%
call docker image rm -f whgovspm/spm-ui-upgrade-helper_nodefront:%VERSION%
call docker image rm -f whgovspm/spm-ui-upgrade-helper:%VERSION%


call docker-compose up %DETACH_CMD% --no-build 

endlocal

goto end
:printHelpAndExit
echo Usage: spm-ui-upgrade-helper.bat error
exit /B 1

:end
