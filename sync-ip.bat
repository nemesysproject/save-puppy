@echo off
pushd "%~dp0"
powershell -ExecutionPolicy Bypass -File .\sync-ip.ps1
pause
popd
