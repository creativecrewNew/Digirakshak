@echo off
echo ========================================
echo DIGIRAKSHAK - GRADLE WRAPPER FIX
echo ========================================
echo.
echo This will download and setup Gradle wrapper automatically
echo.
pause

cd android

echo Downloading Gradle wrapper JAR...
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/gradle/gradle/master/gradle/wrapper/gradle-wrapper.jar' -OutFile 'gradle\wrapper\gradle-wrapper.jar'}"

echo.
echo Gradle wrapper downloaded!
echo.
echo Now building the app...
echo.

call gradlew.bat assembleDebug

echo.
echo ========================================
echo BUILD COMPLETE! Now installing to phone...
echo ========================================
echo.

call gradlew.bat installDebug

pause
