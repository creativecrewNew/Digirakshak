# 🚀 DIGIRAKSHAK - HACKATHON QUICKSTART GUIDE

## ⚡ FASTEST WAY TO RUN THE APP (5 MINUTES)

### Prerequisites Checklist:
- ✅ Java JDK 11 or 17 installed (`java -version`)
- ✅ Node.js installed (`node -v`)
- ✅ Android phone connected via USB
- ✅ USB debugging enabled on phone
- ✅ Phone authorized for debugging (`adb devices` shows "device" not "unauthorized")

---

## 🎯 ONE-COMMAND BUILD & RUN

```powershell
cd C:\Users\Vaibhab\Downloads\project\digirakshak-android
.\BUILD_AND_RUN.bat
```

**This script will:**
1. Install all npm dependencies
2. Generate debug keystore
3. Check your phone connection
4. Start Metro bundler
5. Build the APK
6. Install on your phone
7. Launch the app

---

## 🔧 IF THE SCRIPT FAILS, RUN THESE COMMANDS MANUALLY:

### Step 1: Install Dependencies
```powershell
cd C:\Users\Vaibhab\Downloads\project\digirakshak-android
npm install
```

### Step 2: Authorize Your Phone
```powershell
adb devices
```
**IMPORTANT**: Look at your phone! If you see a popup asking "Allow USB debugging?":
- ✅ Check "Always allow from this computer"
- ✅ Tap "OK"

Run `adb devices` again. You should see:
```
9b0100593053313238002113278c6c    device
```

### Step 3: Generate Keystore (First time only)
```powershell
cd android\app
keytool -genkeypair -v -storetype PKCS12 -keystore debug.keystore -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000 -storepass android -keypass android -dname "CN=Android Debug,O=Android,C=US"
cd ..\..
```

### Step 4: Build & Install
```powershell
cd android
.\gradlew.bat clean
.\gradlew.bat assembleDebug
.\gradlew.bat installDebug
cd ..
```

### Step 5: Start the App
```powershell
# In one terminal, start Metro bundler:
npm start

# In another terminal, open the app on phone:
adb shell am start -n com.digirakshak/.MainActivity
```

---

## 🆘 COMMON ERRORS & FIXES

### Error: "java not recognized"
**Fix**: Install Java JDK 17
```powershell
# Using Chocolatey (run PowerShell as Admin):
choco install microsoft-openjdk17 -y

# OR download manually from:
# https://learn.microsoft.com/en-us/java/openjdk/download
```

### Error: "adb not recognized"
**Fix**: Install Android SDK Platform Tools
```powershell
# Download from: https://developer.android.com/tools/releases/platform-tools
# Extract and add to PATH, or use Android Studio
```

### Error: "Could not find com.facebook.react:react-native-gradle-plugin"
**Fix**: Make sure you ran `npm install` first!
```powershell
npm install
```

### Error: "unauthorized" device
**Fix**: 
1. Look at your phone screen
2. Tap "OK" on the USB debugging popup
3. Check "Always allow from this computer"

### Error: "Execution failed for task ':app:installDebug'"
**Fix**: Make sure your phone is unlocked and the screen is on!

### Error: Metro bundler won't start
**Fix**: Kill existing processes
```powershell
# Kill all node processes
taskkill /F /IM node.exe

# Start fresh
npm start
```

---

## 📱 TESTING THE APP

Once installed, the app will:

1. **Show Language Onboarding** - Select your preferred language (11+ options)
2. **Request SMS Permissions** - Tap "Grant Permission" (REQUIRED for SMS scanning)
3. **Load SMS Messages** - App will scan and analyze all SMS
4. **Show Dashboard** - View fraud statistics and risk analysis

### Key Features to Demo:
- ✅ **SMS Scanner**: Real-time fraud detection with AI analysis
- ✅ **Multi-language Support**: Switch between 11+ Indian languages
- ✅ **Community**: Share fraud warnings (mock data)
- ✅ **Emergency Contacts**: Quick access to cyber crime helpline
- ✅ **Analytics**: Fraud trends and statistics
- ✅ **Dark/Light Mode**: Theme switching

---

## 🎯 DEMO TIPS FOR HACKATHON

1. **Start with language selection** - Show 11+ language support
2. **Grant SMS permission** - Demonstrate real SMS reading
3. **Show fraud detection** - Point out suspicious SMS highlighted in red
4. **Switch languages** - Show same interface in Hindi, Tamil, etc.
5. **Show community feature** - Demonstrate fraud warning sharing
6. **Toggle dark mode** - Show UI polish

---

## 📊 PROJECT STATS TO MENTION

- ✅ **11+ Indian Languages** (Hindi, Tamil, Telugu, Kannada, Malayalam, etc.)
- ✅ **Real SMS Reading** using native Android APIs
- ✅ **AI-powered Fraud Detection** with keyword matching
- ✅ **Complete Type Safety** with TypeScript
- ✅ **Professional UI** with React Native & custom components
- ✅ **Offline-first** approach for rural areas
- ✅ **Accessibility** focused for elderly users

---

## 🔥 IF EVERYTHING FAILS - SHOW THE WEB VERSION

If Android build issues persist, you have a backup:

```powershell
cd C:\Users\Vaibhab\Downloads\project
npm install
npm run dev
```

Open browser to `http://localhost:5173` and demo the web version!

---

## 📞 LAST-MINUTE CHECKLIST (5 MINS BEFORE DEMO)

- [ ] Phone charged and unlocked
- [ ] USB debugging enabled and authorized
- [ ] App installed and tested once
- [ ] Metro bundler running
- [ ] Backup: Web version ready in browser
- [ ] Screen recording ready (optional)
- [ ] Talking points prepared

---

## 🎉 YOU'VE GOT THIS!

Your app solves a real problem (₹10,000+ crore fraud annually in India) with a unique solution (multi-lingual SMS fraud detection). The judges will love it!

**Good luck at the hackathon! 🚀**
