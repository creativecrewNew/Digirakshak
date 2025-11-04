@echo off
echo ========================================
echo DIGIRAKSHAK - COMPLETE BUILD AND RUN
echo ========================================
echo.

echo STEP 1: Installing npm dependencies...
echo ========================================
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

echo.
echo STEP 2: Generating debug keystore...
echo ========================================
cd android\app
if not exist debug.keystore (
    keytool -genkeypair -v -storetype PKCS12 -keystore debug.keystore -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000 -storepass android -keypass android -dname "CN=Android Debug,O=Android,C=US"
    echo Keystore generated!
) else (
    echo Keystore already exists, skipping...
)
cd ..\..

echo.
echo STEP 3: Checking ADB devices...
echo ========================================
adb devices
echo.
echo IMPORTANT: Your phone should show as "device" (NOT "unauthorized")
echo If it shows "unauthorized", check your phone for USB debugging popup!
echo.
pause

echo.
echo STEP 4: Starting Metro bundler in background...
echo ========================================
start "Metro Bundler" cmd /k "npm start"
timeout /t 5

echo.
echo STEP 5: Building and installing app...
echo ========================================
cd android
call gradlew.bat clean
call gradlew.bat assembleDebug
call gradlew.bat installDebug
cd ..

echo.
echo ========================================
echo BUILD COMPLETE!
echo ========================================
echo.
echo The app should now be launching on your phone!
echo.
echo If the app doesn't open automatically:
echo 1. Look for "DigiRakshak" icon on your phone
echo 2. Tap it to launch
echo.
pause
