@echo off
echo ========================================
echo GENERATING DEBUG KEYSTORE FOR DIGIRAKSHAK
echo ========================================
echo.

cd android\app

echo Generating debug.keystore...
keytool -genkeypair -v -storetype PKCS12 -keystore debug.keystore -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000 -storepass android -keypass android -dname "CN=Android Debug,O=Android,C=US"

echo.
echo ========================================
echo KEYSTORE GENERATED SUCCESSFULLY!
echo ========================================
echo.
echo Location: android\app\debug.keystore
echo.
pause
