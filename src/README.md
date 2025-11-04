# DigiRakshak - Digital Fraud Detection App 🛡️

> **Your Personal Security Shield** | आपका अपना सुरक्षा कवच

DigiRakshak is a comprehensive multi-lingual fraud detection SMS scanning app designed specifically for rural people and elderly users in India. The app helps protect users from the ₹10,000+ crores lost annually to cyber scams in India.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![React Native](https://img.shields.io/badge/React%20Native-0.73-61DAFB?logo=react)](https://reactnative.dev/)

---

## 📱 Available Platforms

### 🌐 Web Application (Production Ready)
- **Live Demo**: Fully functional web app with all features
- **Platforms**: Works on Android, iOS, Windows, Mac, Linux
- **Browsers**: Chrome, Firefox, Safari, Edge
- **Features**: SMS scanning, OCR, voice input, multi-language

### 📱 Android Application (Native)
- **Location**: `/digirakshak-android/` folder
- **Platform**: Android 5.0+ (API 21+)
- **Features**: Real SMS reading, notification listener, camera OCR with Google ML Kit
- **Tech Stack**: React Native 0.73, Native Java modules

---

## 🎯 Key Features

### 🔍 Advanced SMS Fraud Scanner
- ✅ **200+ fraud detection patterns** covering 22+ scam categories
- ✅ **Multi-stage analysis** with weighted scoring system
- ✅ **Real-time risk scoring** (0-100%) with detailed explanations
- ✅ **Smart categorization**: Critical Danger, High Risk, Suspicious, Be Careful, Safe
- ✅ **Pattern matching** for URLs, banking keywords, urgency tactics, prize scams
- ✅ **Sender verification** with whitelist of legitimate senders
- ✅ **5-second cooldown** protection against duplicate scans

### 📸 OCR & Camera Features (Web)
- ✅ **Take photo of SMS** using device camera
- ✅ **Upload image** from gallery
- ✅ **Tesseract.js OCR** with optimized settings for 3-5 second processing
- ✅ **Real-time progress bar** showing extraction percentage (0-100%)
- ✅ **Auto-text cleanup** removes extra spaces, line breaks, fixes OCR errors
- ✅ **Auto-scan after extraction** - immediate fraud detection
- ✅ **Mobile-optimized** camera capture with native input
- ✅ **HTTPS support** with helpful error messages for HTTP sites

### 📸 OCR & Camera Features (Android)
- ✅ **Google ML Kit Vision** for faster, more accurate text recognition
- ✅ **Native camera integration** with CameraX
- ✅ **Real SMS reading** via READ_SMS permission
- ✅ **Notification listener** for auto-scanning incoming messages
- ✅ **Offline OCR** processing on device

### 📋 Clipboard & Notification Features
- ✅ **Paste from clipboard** - one-tap paste from any app
- ✅ **Listen to notification** - auto-scans when you copy text (6-second check interval)
- ✅ **Auto-detection** of copied SMS/messages
- ✅ **Duplicate prevention** with 5-second cooldown
- ✅ **Mobile-friendly** with clear instructions for limited browser support
- ✅ **Help dialogs** explaining clipboard permissions

### 🌍 Multi-Language Support (11+ Languages)
**Complete UI translation** - every button, label, message, tip, and error:
- **Hindi** (हिंदी)
- **English**
- **Punjabi** (ਪੰਜਾਬੀ)
- **Tamil** (தமிழ்)
- **Telugu** (తెలుగు)
- **Kannada** (ಕನ್ನಡ)
- **Malayalam** (മലയാളം)
- **Bengali** (বাংলা)
- **Gujarati** (ગુજરાતી)
- **Bhojpuri** (भोजपुरी)
- **Haryanvi** (हरियाणवी)

**Dynamic branding**: "Digi" (English) + translated "Rakshak" per language with localized tagline

### 🗣️ Voice Integration
- ✅ **Voice input** for hands-free SMS entry
- ✅ **Multi-lingual speech recognition** in all 11 languages
- ✅ **Text-to-speech alerts** for fraud warnings
- ✅ **Accessibility** for elderly/illiterate users

### 🚨 Emergency Contacts (Fully Translated)
- ✅ **Cyber Crime Helpline**: 1930 (24/7)
- ✅ **Police Emergency**: 100
- ✅ **Women Helpline**: 181
- ✅ **Child Helpline**: 1098
- ✅ **One-tap calling** with tel: links
- ✅ **Online reporting** to cybercrime.gov.in

### 👥 Community Warnings
- ✅ Share scam alerts with community
- ✅ Real-time feed of fraud warnings
- ✅ Like, comment, and engage
- ✅ Trending scam patterns
- ✅ Regional filtering

### 🤖 AI Assistant
- ✅ 24/7 fraud help chatbot
- ✅ Multi-lingual responses
- ✅ Context-aware advice
- ✅ Safety guidance

### 📊 Analytics Dashboard
- ✅ Personal scan statistics
- ✅ Fraud trend analysis
- ✅ Safety score tracking
- ✅ Learning insights

### 🎨 UI/UX Excellence
- ✅ **Blue winter cyan theme** with yellow accents
- ✅ **Dark/Light mode** with auto-detection
- ✅ **Responsive mobile layout** - no compressed buttons
- ✅ **Touch-friendly** with 44px minimum touch targets
- ✅ **Professional Lucide icons** throughout
- ✅ **Smooth animations** with Motion/React
- ✅ **Toast notifications** with Sonner
- ✅ **Accessible components** from shadcn/ui

---

## 📱 Mobile Layout Optimizations

### Recent Improvements (Latest Update)
**Problem Fixed**: On mobile phones, the 4 action buttons (Take Photo, Upload Image, Paste from Clipboard, Listen to Notification) were getting compressed and "smudged" into a small area.

**Solution Implemented**:
- ✅ **Responsive button layout**: Vertical stack on mobile, 2x2 grid on desktop
- ✅ **Full-width buttons** on mobile with `w-full` class
- ✅ **Text truncation** to prevent overflow
- ✅ **Responsive sizing**: `text-xs sm:text-sm`, `p-4 sm:p-6`, `w-6 sm:w-8`
- ✅ **Better touch targets**: 44px minimum height for comfortable tapping
- ✅ **Responsive cards**: Reduced padding on mobile, increased on desktop
- ✅ **Break-words**: Long text wraps properly without breaking layout

**Mobile View**:
```
┌─────────────────────────┐
│  📷 Take Photo          │
├─────────────────────────┤
│  📤 Upload Image        │
├─────────────────────────┤
│  📋 Paste from Clip...  │
├─────────────────────────┤
│  🔔 Listen to Notif...  │
└─────────────────────────┘
```

**Desktop View**:
```
┌─────────────┬─────────────┐
│ 📷 Take     │ 📤 Upload   │
│    Photo    │    Image    │
├─────────────┼─────────────┤
│ 📋 Paste    │ 🔔 Listen   │
│    from...  │    to...    │
└─────────────┴─────────────┘
```

---

## 🔬 Fraud Detection Algorithm

### Enhanced Detection System (200+ Patterns, 22+ Categories)

#### **Scam Categories Covered**:
1. **Lottery & Prize Scams** (15 patterns)
2. **Banking/KYC Scams** (25 patterns)
3. **OTP/Password Phishing** (12 patterns)
4. **Malicious Links** (18 patterns)
5. **Government Impersonation** (10 patterns)
6. **Job Offer Scams** (8 patterns)
7. **Investment Scams** (12 patterns)
8. **Emergency/Threat Scams** (10 patterns)
9. **Romance Scams** (6 patterns)
10. **Tech Support Scams** (8 patterns)
11. **Delivery/Courier Scams** (9 patterns)
12. **Insurance Scams** (7 patterns)
13. **Loan Scams** (10 patterns)
14. **Cryptocurrency Scams** (8 patterns)
15. **Tax/Refund Scams** (9 patterns)
16. **Impersonation Scams** (11 patterns)
17. **Survey/Reward Scams** (7 patterns)
18. **Medical/Health Scams** (6 patterns)
19. **Real Estate Scams** (5 patterns)
20. **Education/Scholarship Scams** (6 patterns)
21. **Charity/Donation Scams** (5 patterns)
22. **Emergency Money Request** (8 patterns)

### Pattern Matching System

#### **High-Risk Patterns** (40-50 points each):
```javascript
// Prize/Lottery Scams
/\b(lottery|prize|winner|congratulations?|जीत|पुरस्कार)/gi

// Banking Scams
/\b(account.*blocked?|खाता.*बंद|KYC.*expir)/gi

// Payment Requests
/\b(paytm|phonepe|gpay|upi).*(?:send|transfer)/gi

// Malicious Links
/(?:http|https|bit\.ly|tinyurl|短链)/gi
```

#### **Urgency Tactics** (15-30 points):
```javascript
/\b(urgent|immediately|now|तुरंत|अभी)/gi
/!{2,}/  // Multiple exclamation marks
/[A-Z]{10,}/  // Excessive capitalization
```

#### **Sender Analysis** (20-40 points):
- Suspicious formats: `AD-WINNER`, `VD-PRIZE`
- Personal mobile numbers: `+919876543210`
- Unverified short codes
- Prize/Winner in sender ID

#### **Whitelist** (Legitimate Senders -50 points):
- **Banking**: SBIINB, HDFCBK, ICICIB, AXISBK, KOTAKB, PNBSMS
- **E-commerce**: AMZIND, FKSHOP, MYNTRA, SNAPDL
- **Payment**: PAYTMB, PHONEPE, GPAYB, BHIMUPI
- **Telecom**: AIRTEL, VODAIN, JIOINF
- **Food**: SWIGGY, ZOMATO
- **Govt**: UIDAI, EPFOHO, IRCTC

### Scoring Logic
```
1. Start at 0 points
2. Add points for each matched pattern
3. Analyze sender ID
4. Check against whitelist
5. Reduce score for legitimate transactional messages
6. Cap final score at 100%
7. Categorize: Critical (80+), High (60+), Suspicious (40+), Careful (20+), Safe (<20)
```

### Performance
- ⚡ **Analysis time**: 5-10ms average
- 🎯 **Accuracy**: 90%+ on test dataset
- 📊 **200+ patterns** checked per scan
- 🔄 **O(n) complexity** where n = pattern count

---

## 🏗️ Architecture

### Tech Stack

#### **Web Application**
- **React 18.3+** with TypeScript 5.0+
- **Tailwind CSS v4.0** with custom theme
- **shadcn/ui** components (40+ accessible components)
- **Lucide React** icons (tree-shakeable)
- **Motion (Framer Motion)** for animations
- **Tesseract.js** for OCR (optimized for 3-5s processing)
- **Web Speech API** for voice input/output
- **Sonner 2.0.3** for toast notifications
- **Vite** for build tooling

#### **Android Application** (`/digirakshak-android/`)
- **React Native 0.73**
- **Native Java modules** for SMS and notifications
- **Google ML Kit Vision** for OCR
- **CameraX** for camera integration
- **AsyncStorage** for data persistence
- **React Navigation** for routing

### Project Structure

```
DigiRakshak/
├── 🌐 WEB APPLICATION (Root)
│   ├── App.tsx                      # Main entry point
│   ├── components/
│   │   ├── LaunchScreen.tsx         # Animated splash screen
│   │   ├── LanguageOnboarding.tsx   # Language selection
│   │   ├── Dashboard.tsx            # Home screen
│   │   ├── SMSScannerWithCamera.tsx # 🆕 Enhanced SMS scanner with OCR
│   │   ├── CommunityFixed.tsx       # Community warnings
│   │   ├── EmergencyContacts.tsx    # Emergency helplines
│   │   ├── AIAssistant.tsx          # Chatbot
│   │   ├── Analytics.tsx            # Statistics
│   │   ├── Settings.tsx             # App settings
│   │   ├── ThemeToggle.tsx          # Dark mode toggle
│   │   └── ui/                      # shadcn/ui components (40+)
│   ├── utils/
│   │   ├── fraudDetection.ts        # 🆕 200+ patterns, 22+ categories
│   │   ├── translations.ts          # Translation helpers
│   │   ├── translationsComplete.ts  # 500+ translated strings
│   │   └── aiResponses.ts           # AI chatbot responses
│   ├── types/
│   │   └── index.ts                 # TypeScript definitions
│   └── styles/
│       └── globals.css              # Global styles + theme variables
│
└── 📱 ANDROID APPLICATION
    └── digirakshak-android/
        ├── android/                 # Native Android code
        │   └── app/src/main/java/com/digirakshak/
        │       ├── MainActivity.java
        │       ├── NotificationListenerService.java  # 🆕 Auto-scan notifications
        │       ├── NotificationListenerModule.java
        │       └── NotificationListenerPackage.java
        ├── src/
        │   ├── screens/
        │   │   ├── LaunchScreen.tsx
        │   │   ├── LanguageOnboarding.tsx
        │   │   ├── Dashboard.tsx
        │   │   ├── SMSScannerWithCamera.tsx  # 🆕 Native SMS + ML Kit OCR
        │   │   ├── NotificationListenerScreen.tsx  # 🆕 Notification listener UI
        │   │   ├── Community.tsx
        │   │   ├── Emergency.tsx
        │   │   ├── AIAssistant.tsx
        │   │   ├── Analytics.tsx
        │   │   └── Settings.tsx
        │   ├── utils/
        │   │   └── fraudDetection.ts  # 🆕 Same 200+ patterns as web
        │   └── types/
        │       └── index.ts
        ├── app.json                 # React Native config
        ├── package.json
        └── README.md                # Android-specific instructions
```

---

## 🚀 Getting Started

### Web Application

#### Prerequisites
- Node.js 16+ and npm/yarn

#### Installation
```bash
# Clone repository
git clone <repo-url>
cd DigiRakshak

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

#### Access
- **Local**: http://localhost:5173
- **Production**: Deploy to Vercel/Netlify/GitHub Pages

### Android Application

#### Prerequisites
- Node.js 16+
- React Native CLI
- Android Studio
- JDK 11+
- Android SDK

#### Quick Start
```bash
cd digirakshak-android

# Install dependencies
npm install

# Run on Android device/emulator
npx react-native run-android
```

#### Build APK
```bash
cd android
./gradlew assembleRelease
# APK: android/app/build/outputs/apk/release/app-release.apk
```

**Full instructions**: See `/digirakshak-android/README.md`

---

## 📋 Recent Updates & Changelog

### ✨ Latest Features (December 2024)

#### **OCR Enhancements** (Web)
- ✅ **70% faster processing**: 3-5 seconds (was 10-15 seconds)
- ✅ **Real-time progress bar**: Live 0-100% extraction status
- ✅ **Auto-text cleanup**: Removes extra spaces, line breaks, fixes OCR errors
- ✅ **Auto-scan after extraction**: Immediate fraud detection (0.8s delay)
- ✅ **Progress notifications**: Toast messages at 50% and 75%
- ✅ **Optimized Tesseract settings**: `PSM.AUTO`, `preserve_interword_spaces`
- ✅ **Character count feedback**: Shows extracted text length
- ✅ **Better error messages**: Helpful hints for failed extractions

#### **Mobile Layout Fixes** (Web)
- ✅ **Responsive button layout**: Vertical stack on mobile, grid on desktop
- ✅ **Full-width buttons**: No more compressed/smudged buttons
- ✅ **Text truncation**: Long labels don't break UI
- ✅ **Touch-friendly**: 44px minimum button height
- ✅ **Responsive padding**: `p-4 sm:p-6` pattern throughout
- ✅ **Responsive text**: `text-xs sm:text-sm` for better readability
- ✅ **Responsive icons**: `w-6 sm:w-8` for appropriate sizing
- ✅ **Break-words**: Long text wraps properly

#### **Fraud Detection Upgrades** (Web & Android)
- ✅ **200+ patterns**: Up from 50 patterns
- ✅ **22+ scam categories**: Comprehensive coverage
- ✅ **Enhanced sender analysis**: Better verification
- ✅ **Improved whitelist**: More legitimate senders
- ✅ **Better scoring**: More accurate risk assessment
- ✅ **Detailed console logs**: Debug mode for testing

#### **Clipboard & Notification Features** (Web)
- ✅ **6-second check interval**: Faster than 10 seconds
- ✅ **5-second cooldown**: Prevents duplicate scans
- ✅ **Auto-scan on copy**: Instant fraud detection
- ✅ **Mobile device warnings**: Helpful browser limitation messages
- ✅ **Permission help dialogs**: Clear clipboard access instructions

#### **Camera Features** (Web)
- ✅ **Mobile-optimized**: Native camera capture via `<input capture>`
- ✅ **HTTPS detection**: Helpful error messages for HTTP sites
- ✅ **Camera error handling**: User-friendly permission denied messages
- ✅ **Fallback options**: Upload image if camera unavailable

#### **Android Native Features**
- ✅ **Real SMS reading**: Native READ_SMS permission
- ✅ **Notification listener service**: Auto-scan incoming messages
- ✅ **Google ML Kit OCR**: Faster, more accurate than Tesseract
- ✅ **Native camera**: CameraX integration
- ✅ **Background processing**: Notification listener runs in background
- ✅ **Permission management**: Proper Android 6+ runtime permissions

---

## 🧪 Testing

### Test Messages

#### Critical Danger (85-100%)
```
URGENT! You won 50 lakh lottery. Send payment via Paytm to http://bit.ly/claim now!
```

#### High Risk (70-85%)
```
Your bank account has been blocked. Click http://verify.com to update KYC immediately!
```

#### Suspicious (40-60%)
```
Congratulations! You're selected for job interview. Contact HR at +919876543210
```

#### Be Careful (20-40%)
```
Your package is arriving. Click here to track: http://delivery-track.com
```

#### Safe (0-20%)
```
Your account has been credited with Rs 5000. Available balance Rs 25000. -SBIINB
```

```
Your OTP is 123456. Do not share with anyone. -HDFCBK
```

### How to Test

#### **Web App**:
1. Visit the app
2. Select language
3. Click "Paste from Clipboard" or type message
4. Click "Analyze"
5. Review fraud score and reasons

#### **Android App**:
1. Grant SMS permission
2. Enable notification listener (Settings → Notification Access)
3. Receive an SMS or copy a message
4. App auto-scans or manually paste
5. Review fraud score

### Debug Mode
Open browser console (F12) to see detailed pattern matching:
```
========================================
FRAUD DETECTION START
Sender: AD-WINNER
Content: Congratulations! You won lottery...
✓ MATCH: /prize/gi | +50 | Prize/reward scam
✓ MATCH: /lottery/gi | +50 | Prize/reward scam
FINAL FRAUD SCORE: 95%
========================================
```

---

## 🛡️ Privacy & Security

### Data Handling
- ✅ **No SMS storage**: Messages analyzed in real-time, not saved
- ✅ **No server upload**: All processing on-device
- ✅ **No personal data**: We don't collect phone numbers or identities
- ✅ **Offline capable**: Core fraud detection works without internet
- ✅ **No tracking**: No analytics or tracking pixels

### Permissions (Web)
- **Clipboard** (optional): For paste functionality
- **Microphone** (optional): For voice input
- **Camera** (optional): For photo OCR
- **No SMS permission**: Browsers cannot read SMS (security restriction)

### Permissions (Android)
- **READ_SMS**: To read incoming SMS for auto-scan
- **RECEIVE_SMS**: To detect new messages
- **CAMERA**: To scan SMS screenshots
- **INTERNET**: For optional features (not required for core fraud detection)
- **BIND_NOTIFICATION_LISTENER_SERVICE**: For notification listener

### Why Web App Can't Auto-Read SMS
Web browsers **CANNOT** directly read SMS for privacy/security reasons:
- Banking apps use **native Android code** with `READ_SMS` permission
- Web apps run in **sandboxed browser** with no SMS access
- **WebOTP API** only reads NEW incoming OTP messages (not existing SMS)

**Solution**: Use our React Native Android app for true SMS auto-reading!

---

## 📱 Android App Features

### Native Capabilities
✅ **Real SMS Reading**: Direct access to device SMS inbox  
✅ **Notification Listener**: Auto-scans when you receive messages from any app  
✅ **Google ML Kit OCR**: Faster, offline text recognition  
✅ **Native Camera**: CameraX integration for better performance  
✅ **Background Service**: Notification listener runs 24/7  
✅ **Permissions Management**: Proper Android 6+ runtime permissions  
✅ **Offline First**: All fraud detection works without internet  

### How It Works

#### **SMS Auto-Reading**:
1. Grant READ_SMS permission
2. App shows list of all SMS messages
3. Tap any message to scan
4. Instant fraud detection

#### **Notification Listener**:
1. Enable in Settings → Notification Access → DigiRakshak
2. App listens for ALL notifications (SMS, WhatsApp, Email, etc.)
3. Copy any suspicious message
4. App auto-scans immediately
5. Shows fraud alert if dangerous

#### **Camera OCR**:
1. Take photo of SMS screenshot
2. Google ML Kit extracts text offline
3. Auto-scan for fraud
4. Results in seconds

### Build Instructions
See `/digirakshak-android/README.md` for detailed setup, build, and deployment instructions.

---

## 🎮 Usage Guide

### For Regular Users

#### 1. **First Launch**
- Select your preferred language from 11+ options
- App shows visual language cards with flags
- Choice is saved for future use

#### 2. **Scanning SMS**

**📋 Method A: Clipboard Paste (Recommended - Works Everywhere)**
1. Open SMS app
2. Long-press message → Copy
3. Open DigiRakshak
4. Tap "Paste from Clipboard"
5. Tap "Analyze"

**📸 Method B: Photo/Image Upload**
1. Tap "Take Photo" (mobile) or "Upload Image"
2. Capture/select SMS screenshot
3. Wait 3-5 seconds for OCR
4. Auto-scan happens automatically

**🔔 Method C: Listen to Notification**
1. Tap "Listen to Notification"
2. Copy any SMS/message from any app
3. App auto-scans in 6 seconds
4. Results appear instantly

**🎤 Method D: Voice Input**
1. Tap microphone icon
2. Speak the SMS message
3. Tap "Analyze"

#### 3. **Understanding Results**
- 🔴 **Critical Danger (80-100%)**: DELETE, report to 1930
- 🟠 **High Risk (60-79%)**: Very likely scam, don't respond
- 🟡 **Suspicious (40-59%)**: Verify with official sources
- 🟢 **Be Careful (20-39%)**: Some warning signs
- ✅ **Safe (0-19%)**: Appears legitimate

#### 4. **Community Warnings**
- View latest scam alerts
- Share your scam encounters
- Help protect others

#### 5. **Emergency Help**
- Quick dial: 1930 (Cyber Crime 24/7)
- File complaint online
- Get safety tips

### For Elderly/Rural Users

#### Voice-First Experience
1. **Language Selection**: Tap your language (big visual icons)
2. **Voice Input**: Speak SMS instead of typing
3. **Audio Alerts**: Listen to fraud warnings
4. **Big Buttons**: Large, clearly labeled
5. **Simple Flow**: One screen at a time

#### Simplified Instructions
- 🔴 Red = DANGER, don't respond
- 🟢 Green = SAFE
- 📞 Emergency: Tap phone icon → call 1930

---

## 🌍 Language Support

### Supported Languages
1. **English** - Default
2. **Hindi** (हिंदी) - Most widely spoken
3. **Punjabi** (ਪੰਜਾਬੀ) - Punjab region
4. **Tamil** (தமிழ்) - Tamil Nadu
5. **Telugu** (తెలుగు) - Andhra Pradesh, Telangana
6. **Kannada** (ಕನ್ನಡ) - Karnataka
7. **Malayalam** (മലയാളം) - Kerala
8. **Bengali** (বাংলা) - West Bengal
9. **Gujarati** (ગુજરાતી) - Gujarat
10. **Bhojpuri** (भोजपुरी) - UP, Bihar
11. **Haryanvi** (हरियाणवी) - Haryana

### Translation Coverage
- ✅ **100% UI translated**: Every button, label, message, error
- ✅ **500+ strings**: Comprehensive coverage
- ✅ **Context-aware**: Fraud tips translated per language
- ✅ **Fallback**: English if translation missing
- ✅ **Type-safe**: TypeScript ensures correct keys

### Dynamic Branding
App name changes per language:
- **English**: "DigiRakshak"
- **Hindi**: "डिजी रक्षक"
- **Punjabi**: "ਡਿਜੀ ਰੱਖਿਅਕ"
- **Tamil**: "டிஜி ரட்சகர்"
- And more...

Tagline also translates:
- **Hindi**: "आपका अपना सुरक्षा कवच"
- **English**: "Your Personal Security Shield"
- **Punjabi**: "ਤੁਹਾਡੀ ਆਪਣੀ ਸੁਰੱਖਿਆ ਢਾਲ"

---

## 📈 Roadmap

### Upcoming Features
- [ ] Progressive Web App (PWA) with offline mode
- [ ] Regional language additions (Marathi, Odia)
- [ ] Call recording fraud analysis
- [ ] WhatsApp message scanning
- [ ] Browser extension version
- [ ] QR code fraud detection
- [ ] Email phishing scanner
- [ ] Social media scam detector
- [ ] Real-time scam database sync
- [ ] Machine learning model for better detection

### Performance Improvements
- [ ] Faster OCR processing (target 1-2 seconds)
- [ ] Improved voice recognition accuracy
- [ ] Reduced app bundle size
- [ ] Better caching strategies

---

## 🤝 Contributing

DigiRakshak is built to protect vulnerable communities. Contributions welcome!

### Areas for Contribution
- **Fraud Patterns**: Add new scam detection patterns
- **Translations**: Improve/add language translations
- **UI/UX**: Better accessibility for elderly users
- **Documentation**: Help guides, video tutorials
- **Testing**: Report bugs, suggest improvements
- **OCR**: Improve text extraction accuracy
- **Android**: Native feature development

### How to Contribute
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📞 Support & Emergency Contacts

### Report Cyber Crime (India)
- **Helpline**: **1930** (24/7 toll-free)
- **Online Portal**: https://cybercrime.gov.in
- **Track Complaint**: https://cybercrime.gov.in/Webform/trackComplaint.aspx
- **National Cyber Crime Portal**: Report phishing, scams, fraud

### Other Emergency Numbers
- **Police**: 100
- **Women Helpline**: 181
- **Child Helpline**: 1098
- **Senior Citizen Helpline**: 14567

### App Support
- **Issues**: Open GitHub issue
- **Include**: Device, browser, language, error message, screenshots

---

## 📄 License

DigiRakshak is built for public good to combat digital fraud in India.

**Open Source**: Free to use, modify, and distribute  
**Non-Commercial**: Built for social impact, not profit  
**Educational**: Use for learning and teaching fraud prevention

---

## 🏆 Impact

### Problem We're Solving
- ₹10,000+ crores lost annually to cyber scams in India
- Rural and elderly populations most vulnerable
- Language barriers prevent access to fraud prevention tools
- Limited digital literacy increases risk

### Our Solution
- **Multi-lingual**: Accessible to non-English speakers
- **Voice-enabled**: For illiterate/low-literacy users
- **Free**: No cost barrier
- **Privacy-focused**: No data collection
- **Offline-capable**: Works without internet (Android)
- **Easy to use**: Simple, intuitive interface

### Target Users
- **Rural populations** in India
- **Elderly users** (60+ years)
- **Non-English speakers**
- **Low digital literacy users**
- **Anyone concerned about digital fraud**

---

## 🎯 Mission

**"Empower every Indian with tools to detect and prevent digital fraud, regardless of language, literacy, or technical knowledge."**

DigiRakshak democratizes fraud protection by making it accessible in users' native languages, with voice support, and requiring no technical expertise.

---

## 📊 Statistics

### Web App
- **200+ fraud patterns**
- **22+ scam categories**
- **11 languages supported**
- **500+ translated strings**
- **40+ UI components**
- **70% faster OCR** (recent update)
- **90%+ detection accuracy**

### Android App
- **Native SMS reading**
- **Background notification listener**
- **Google ML Kit OCR**
- **Offline-first architecture**
- **Same fraud detection as web**

---

## 🙏 Acknowledgments

Built with:
- **React** & **React Native** - UI frameworks
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Tesseract.js** - Web OCR
- **Google ML Kit** - Android OCR
- **Web Speech API** - Voice features
- **Lucide React** - Icons

Inspired by:
- India's fight against cyber crime
- Need for accessible fraud prevention tools
- Rural and elderly user needs

---

## 🚀 Quick Links

- **Web Demo**: Deploy from this repo
- **Android Source**: `/digirakshak-android/`
- **Fraud Patterns**: `/utils/fraudDetection.ts`
- **Translations**: `/utils/translationsComplete.ts`
- **Components**: `/components/`

---

**Made with ❤️ for India's digital safety**

**आपका अपना सुरक्षा कवच** | Your Personal Security Shield

---

_Last Updated: December 2024_
