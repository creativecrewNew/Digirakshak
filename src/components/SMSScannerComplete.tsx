import React, { useState, useEffect } from 'react';
import { Scan, AlertTriangle, CheckCircle, Info, Volume2, Shield, Smartphone, Copy, AlertCircle, Camera, Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Language, SMSMessage } from '../types';
import { analyzeSMS, getAlertMessage, getFraudTips } from '../utils/fraudDetection';
import { readLatestSMS, getSMSReaderErrorMessage, isSMSReadingSupported, getSMSRecommendation } from '../utils/smsReader';
import { t } from '../utils/translations';
import { toast } from 'sonner@2.0.3';
import Tesseract from 'tesseract.js';

interface SMSScannerProps {
  language: Language;
  onScan: (message: SMSMessage) => void;
}

// Complete translations for ALL languages
const tr = (key: string, language: Language): string => {
  const translations: Record<string, Record<Language, string>> = {
    senderPlaceholder: {
      en: 'e.g., SBIINB, +919876543210, AD-REWARD',
      hi: 'जैसे, SBIINB, +919876543210, AD-REWARD',
      pa: 'ਜਿਵੇਂ, SBIINB, +919876543210, AD-REWARD',
      ta: 'எ.கா., SBIINB, +919876543210, AD-REWARD',
      te: 'ఉదా., SBIINB, +919876543210, AD-REWARD',
      kn: 'ಉದಾ., SBIINB, +919876543210, AD-REWARD',
      ml: 'ഉദാ., SBIINB, +919876543210, AD-REWARD',
      bn: 'যেমন, SBIINB, +919876543210, AD-REWARD',
      gu: 'દાત., SBIINB, +919876543210, AD-REWARD',
      bho: 'जइसे, SBIINB, +919876543210, AD-REWARD',
      hne: 'जसे, SBIINB, +919876543210, AD-REWARD',
    },
    messagePlaceholder: {
      en: 'Paste the SMS content here...',
      hi: 'SMS का पाठ यहां पेस्ट करें...',
      pa: 'ਇੱਥੇ SMS ਸਮੱਗਰੀ ਪੇਸਟ ਕਰੋ...',
      ta: 'SMS உள்ளடக்கத்தை இங்கே ஒட்டவும்...',
      te: 'SMS కంటెంట్‌ను ఇక్కడ పేస్ట్ చేయండి...',
      kn: 'SMS ವಿಷಯವನ್ನು ಇಲ್ಲಿ ಅಂಟಿಸಿ...',
      ml: 'SMS ഉള்ளടക്കം ഇവിടെ പേസ്റ്റ് ചെയ്യുക...',
      bn: 'এখানে SMS বিষয়বস্তু পেস্ট করুন...',
      gu: 'અહીં SMS સામગ્રી પેસ્ટ કરો...',
      bho: 'SMS के सामग्री इहाँ पेस्ट करीं...',
      hne: 'SMS की सामग्री यहाँ पेस्ट करो...',
    },
    optional: {
      en: 'Optional',
      hi: 'वैकल्पिक',
      pa: 'ਵਿਕਲਪਿਕ',
      ta: 'விருப்பமானது',
      te: 'ఐచ్ఛికం',
      kn: 'ಐಚ್ಛಿಕ',
      ml: 'ഓപ്ഷണൽ',
      bn: 'ঐচ্ছিক',
      gu: 'વૈકલ્પિક',
      bho: 'वैकल्पिक',
      hne: 'वैकल्पिक',
    },
    scanning: {
      en: 'Scanning...',
      hi: 'स्कैन कर रहे हैं...',
      pa: 'ਸਕੈਨ ਕਰ ਰਿਹਾ ਹੈ...',
      ta: 'ஸ்கேன் செய்கிறது...',
      te: 'స్కాన్ చేస్తోంది...',
      kn: 'ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
      ml: 'സ്കാൻ ചെയ്യുന്നു...',
      bn: 'স্ক্যান করা হচ্ছে...',
      gu: 'સ્કેન કરી રહ્યું છે...',
      bho: 'स्कैन हो रहल बा...',
      hne: 'स्कैन हो रहा है...',
    },
    clearResults: {
      en: 'Clear',
      hi: 'साफ़ करें',
      pa: 'ਸਾਫ਼ ਕਰੋ',
      ta: 'அழி',
      te: 'క్లియర్',
      kn: 'ತೆರವುಗೊಳಿಸಿ',
      ml: 'മായ്ക്കുക',
      bn: 'মুছুন',
      gu: 'સાફ કરો',
      bho: 'साफ करीं',
      hne: 'साफ करो',
    },
    criticalDanger: {
      en: 'Critical Danger',
      hi: 'गंभीर खतरा',
      pa: 'ਗੰਭੀਰ ਖ਼ਤਰਾ',
      ta: 'கடுமையான ஆபத்து',
      te: 'తీవ్రమైన ప్రమాదం',
      kn: 'ಗಂಭೀರ ಅಪಾಯ',
      ml: 'ഗുരുതരമായ അപകടം',
      bn: 'গুরুতর বিপদ',
      gu: 'ગંભીર ભય',
      bho: 'गंभीर खतरा',
      hne: 'गंभीर खतरा',
    },
    highRisk: {
      en: 'High Risk',
      hi: 'उच्च जोखिम',
      pa: 'ਉੱਚ ਖ਼ਤਰਾ',
      ta: 'அதிக ஆபத்து',
      te: 'అధిక ప్రమాదం',
      kn: 'হೆಚ್ಚಿನ ಅಪಾಯ',
      ml: 'ഉയർന്ന അപകടസാധ്യത',
      bn: 'উচ্চ ঝুঁকি',
      gu: 'ઉચ્ચ જોખમ',
      bho: 'उच्च जोखिम',
      hne: 'उच्च जोखिम',
    },
    suspicious: {
      en: 'Suspicious',
      hi: 'संदिग्ध',
      pa: 'ਸ਼ੱਕੀ',
      ta: 'சந்தேகத்திற்குரியது',
      te: 'అనుమానాస్పదం',
      kn: 'ಸಂಶಯಾಸ್ಪದ',
      ml: 'സംശയാസ്പദം',
      bn: 'সন্দেহজনক',
      gu: 'શંકાસ્પદ',
      bho: 'संदिग्ध',
      hne: 'संदिग्ध',
    },
    beCareful: {
      en: 'Be Careful',
      hi: 'सावधानी बरतें',
      pa: 'ਸਾਵਧਾਨ ਰਹੋ',
      ta: 'கவனமாக இருங்கள்',
      te: 'జాగ్రత్తగా ఉండండి',
      kn: 'ಎಚ್ಚರದಿಂದಿરಿ',
      ml: 'ശ്രദ്ധിക്കുക',
      bn: 'সতর্ক থাকুন',
      gu: 'સાવચેત રહો',
      bho: 'सावधानी बरतीं',
      hne: 'सावधानी बरतो',
    },
    safe: {
      en: 'Safe',
      hi: 'सुरक्षित',
      pa: 'ਸੁਰੱਖਿਅਤ',
      ta: 'பாதுகாப்பானது',
      te: 'సురక్షితం',
      kn: 'ಸುರಕ್ಷಿತ',
      ml: 'സുരക്ഷിതം',
      bn: 'নিরাপদ',
      gu: 'સુરક્ષિત',
      bho: 'सुरक्षित',
      hne: 'सुरक्षित',
    },
    tipMessage: {
      en: 'Tip: Easiest way is to copy the SMS and use "Paste from Clipboard" button. Automatic SMS reading only works on some devices.',
      hi: 'टिप: सबसे आसान तरीका है SMS को कॉपी करें और "क्लिपबोर्ड से पेस्ट करें" बटन का उपयोग करें। स्वचालित SMS पढ़ना केवल कुछ उपकरणों पर काम करता है।',
      pa: 'ਸੁਝਾਅ: ਸਭ ਤੋਂ ਆਸਾਨ ਤਰੀਕਾ ਹੈ SMS ਨੂੰ ਕਾਪੀ ਕਰੋ ਅਤੇ "ਕਲਿੱਪਬੋਰਡ ਤੋਂ ਪੇਸਟ ਕਰੋ" ਬਟਨ ਵਰਤੋ। ਸਵੈਚਲਿਤ SMS ਪੜ੍ਹਨਾ ਕੁਝ ਡਿਵਾਈਸਾਂ ਤੇ ਹੀ ਕੰਮ ਕਰਦਾ ਹੈ।',
      ta: 'உதவிக்குறிப்பு: எளிதான வழி SMS ஐ நகலெடுத்து "கிளிப்போர்டில் இருந்து ஒட்டுக" பொத்தானைப் பயன்படுத்துவது. தானாக SMS படித்தல் சில சாதனங்களில் மட்டுமே வேலை செய்கிறது.',
      te: 'చిట్కా: SMS ను కాపీ చేసి "క్లిప్‌బోర్డ్ నుండి పేస్ట్ చేయండి" బటన్‌ను ఉపయోగించడం సులభమైన మార్గం. ఆటోమేటిక్ SMS చదవడం కొన్ని పరికరాలలో మాత్రమే పని చేస్తుంది.',
      kn: 'ಸಲಹೆ: SMS ಅన್ನು ನకலಿಸಿ ಮತ್ತು "ಕ್ಲಿಪ್ಬೋರ್ಡ್ನಿಂದ ಅಂಟಿಸಿ" ಬಟನ್ ಬಳಸುವುದು ಸುಲಭವಾದ ಮಾರ್ಗ. ಸ್ವಯಂಚಾಲಿತ SMS ಓದುವಿಕೆ ಕೆಲವು ಸಾಧನಗಳ್ಲಿ ಮಾತ್ರ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.',
      ml: 'നുറുങ്ങ്: SMS പകർത്തി "ക്ലിപ്പ്ബോർഡിൽ നിന്ന് പേസ്റ്റ് ചെയ്യുക" ബട്ടൺ ഉപയോഗിക്കുന്നതാണ് എളുപ്പവഴി. സ്വയമേവയുള്ള SMS വായന ചില ഉപകരണങ്ങളിൽ മാത്രമേ പ്രവർത്തിക്കൂ.',
      bn: 'পরামর্শ: SMS কপি করে "ক্লিপবোর্ড থেকে পেস্ট করুন" বোতাম ব্যবহার করা সবচেয়ে সহজ উপায়। স্বয়ংক্রিয় SMS পড়া শুধুমাত্র কিছু ডিভাইসে কাজ করে।',
      gu: 'ટિપ: SMS ની નકલ કરો અને "ક્લિપબોર્ડમાંથી પેસ્ટ કરો" બટનનો ઉપયોગ કરો તે સૌથી સરળ રસ્તો છે। સ્વચાલિત SMS વાંચન માત્ર કેટલાક ઉપકરણો પર કામ કરે છે.',
      bho: 'टिप: SMS के कॉपी करके "क्लिपबोर्ड से पेस्ट करीं" बटन के इस्तेमाल करल सबसे आसान तरीका बा। स्वचालित SMS पढ़ल कुछ डिवाइस पर काम करेला।',
      hne: 'टिप: SMS नै कॉपी करके "क्लिपबोर्ड तै पेस्ट करो" बटन का इस्तेमाल करणा सबतै आसान तरीका है। स्वचालित SMS पढ़ना कुछ डिवाइस पै काम करै है।',
    },
    smsNotWorking: {
      en: 'Why SMS Scanning Does Not Work',
      hi: 'SMS स्कैनिंग क्यों काम नहीं करती',
      pa: 'SMS ਸਕੈਨਿੰਗ ਕਿਉਂ ਕੰਮ ਨਹੀਂ ਕਰਦੀ',
      ta: 'SMS ஸ்கேனிங் ஏன் வேலை செய்யவில்லை',
      te: 'SMS స్కానింగ్ ఎందుకు పని చేయదు',
      kn: 'SMS ಸ್ಕ್ಯಾನಿಂಗ್ ಏకೆ ಕೆಲಸ ಮಾಡುವುದಿಲ್ಲ',
      ml: 'SMS സ്കാനിംഗ് പ്രവർത്തിക്കാത്തത് എന്തുകൊണ്ട്',
      bn: 'SMS স্ক্যানিং কেন কাজ করে না',
      gu: 'SMS સ્કેનિંગ કેમ કામ કરતું નથી',
      bho: 'SMS स्कैनिंग काहे काम ना करत',
      hne: 'SMS स्कैनिंग क्यूं काम नी करै',
    },
    smsNotWorkingDesc: {
      en: 'Web browsers cannot directly read your phone\'s SMS messages for privacy and security reasons. The "Read Phone SMS" button only works on Chrome Android 84+ and only for OTP-style messages.\n\n✅ BEST METHOD: Copy any SMS message from your phone and tap the "Paste from Clipboard" button above. This works on ALL devices!',
      hi: 'गोपनीयता और सुरक्षा कारणों से वेब ब्राउज़र सीधे आपके फ़ोन के SMS संदेशों को नहीं पढ़ सकते। "फ़ोन SMS पढ़ें" बटन केवल Chrome Android 84+ पर और केवल OTP-शैली के संदेशों के लिए काम करता है।\n\n✅ सर्वोत्तम तरीका: अपने फ़ोन से कोई भी SMS संदेश कॉपी करें और ऊपर "क्लिपबोर्ड से पेस्ट करें" बटन टैप करें। यह सभी उपकरणों पर काम करता है!',
      pa: 'ਗੋਪਨੀਯਤਾ ਅਤੇ ਸੁਰੱਖਿਆ ਕਾਰਨਾਂ ਕਰਕੇ ਵੈੱਬ ਬ੍ਰਾਊਜ਼ਰ ਤੁਹਾਡੇ ਫ਼ੋਨ ਦੇ SMS ਸੁਨੇਹਿਆਂ ਨੂੰ ਸਿੱਧੇ ਨਹੀਂ ਪੜ੍ਹ ਸਕਦੇ। "ਫ਼ੋਨ SMS ਪੜ੍ਹੋ" ਬਟਨ ਸਿਰਫ਼ Chrome Android 84+ ਤੇ ਅਤੇ ਸਿਰਫ਼ OTP-ਸ਼ੈਲੀ ਦੇ ਸੁਨੇਹਿਆਂ ਲਈ ਕੰਮ ਕਰਦਾ ਹੈ।\n\n✅ ਸਭ ਤੋਂ ਵਧੀਆ ਤਰੀਕਾ: ਆਪਣੇ ਫ਼ੋਨ ਤੋਂ ਕੋਈ ਵੀ SMS ਸੁਨੇਹਾ ਕਾਪੀ ਕਰੋ ਅਤੇ ਉੱਪਰ "ਕਲਿੱਪਬੋਰਡ ਤੋਂ ਪੇਸਟ ਕਰੋ" ਬਟਨ ਟੈਪ ਕਰੋ। ਇਹ ਸਾਰੇ ਡਿਵਾਈਸਾਂ ਤੇ ਕੰਮ ਕਰਦਾ ਹੈ!',
      ta: 'தனியுரிமை மற்றும் பாதுகாப்பு காரணங்களுக்காக வலை உலாவிகள் உங்கள் தொலைபேசியின் SMS செய்திகளை நேரடியாக படிக்க முடியாது. "தொலைபேசி SMS ஐ படிக்கவும்" பொத்தான் Chrome Android 84+ இல் மட்டுமே மற்றும் OTP-பாணி செய்திகளுக்கு மட்டுமே வேலை செய்கிறது।\n\n✅ சிறந்த முறை: உங்கள் தொலைபேசியில் இருந்து எந்த SMS செய்தியையும் நகலெடுத்து மேலே உள்ள "கிளிப்போர்டில் இருந்து ஒட்டுக" பொத்தானைத் தட்டவும். இது அனைத்து சாதனங்களிலும் வேலை செய்கிறது!',
      te: 'గోప్యత మరియు భద్రతా కారణాల వల్ల వెబ్ బ్రౌజర్లు మీ ఫోన్ SMS సందేశాలను నేరుగా చదవలేవు. "ఫోన్ SMS చదవండి" బటన్ Chrome Android 84+ లో మాత్రమే మరియు OTP-శైలి సందేశాలకు మాత్రమే పని చేస్తుంది।\n\n✅ ఉత్తమ పద్ధతి: మీ ఫోన్ నుండి ఏదైనా SMS సందేశాన్ని కాపీ చేసి పైన ఉన్న "క్లిప్‌బోర్డ్ నుండి పేస్ట్ చేయండి" బటన్‌ను నొక్కండి. ఇది అన్ని పరికరాలలో పని చేస్తుంది!',
      kn: 'ಗೌಪ್ಯತೆ ಮತ್ತು ಭದ್ರತಾ ಕಾರಣಗಳಗಾಗಿ ವೆಬ್ ಬ್ರೌಸರ್‌ಗಳು ನಿಮ್ಮ ಫೋನ್‌ನ SMS ಸಂದೇಶಗಳನ್ನು ನೇರವಾಗಿ ಓದಲು ಸಾಧ್ಯವಿಲ್ಲ। "ಫೋನ್ SMS ಓದಿ" ಬಟನ್ Chrome Android 84+ ನಲ್ಲಿ ಮಾತ್ರ ಮತ್ತು OTP-ಶೈಲಿ ಸಂದೇಶಗಳಿಗೆ ಮಾತ್ರ ಕಾರ್ನಿರ್ವಹಿಸುತ್ತದೆ।\n\n✅ ಉತ್ ವಿಧಾನ: ನಿಮ್ಮ ಫೋನ್‌ನಿಂದ ಯಾವುದೇ SMS ಸಂದೇಶವನ್ನು ನಕಲಿಸಿ ಮತ್ತು ಮೇಲಿನ "ಕ್ಲಿಪ್ಬೋರ್ಡ್ನಿಂದ ಅಂಟಿಸಿ" ಬಟನ್ ಅನ್ನು ಟ್ಾಪ್ ಮಾಡಿ। ಇದು ಎಲ್ಲಾ ಸಾಧನಗಳಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ!',
      ml: 'സ്വകാര്യതയ്ക്കും സുരക്ഷയ്ക്കും വേണ്ടി വെബ് ബ്രൗസറുകൾക്ക് നിങ്ങളുടെ ഫോണിന്റെ SMS സന്ദേശങ്ങൾ നേരിട്ട് വായിക്കാൻ കഴിയില്ല। "ഫോൺ SMS വായിക്കുക" ബട്ടൺ Chrome Android 84+ ൽ മാത്രമേ പ്രവർത്തിക്കൂ, അതും OTP-സ്റ്റൈൽ സന്ദേശങ്ങൾക്ക് മാത്രം।\n\n✅ മികച്ച രീതി: നിങ്ങളുടെ ഫോണിൽ നിന്ന് ഏതെങ്കിലും SMS സന്ദേശം പകർത്തി മുകളിലുള്ള "ക്ലിപ്പ്ബോർഡിൽ നിന്ന് പേസ്റ്റ് ചെയ്യുക" ബട്ടൺ ടാപ്പ് ചെയ്യുക। ഇത് എല്ലാ ഉപകരണങ്ങളിലും പ്രവർത്തിക്കുന്നു!',
      bn: 'গোপনীয়তা এবং নিরাপত্তার কারণে ওয়েব ব্রাউজারগুলি সরাসরি আপনার ফোনের SMS বার্তা পড়তে পারে না। "ফোন SMS পড়ুন" বোতামটি শুধুমাত্র Chrome Android 84+ এ এবং শুধুমাত্র OTP-স্টাইল বার্তার জন্য কাজ করে।\n\n✅ সেরা পদ্ধতি: আপনার ফোন থেকে যেকোনো SMS বার্তা কপি করুন এবং উপরে "ক্লিপবোর্ড থেকে পেস্ট করুন" বোতাম ট্যাপ করুন। এটি সব ডিভাইসে কাজ করে!',
      gu: 'গોપનીયતા અને સુરક્ષાના કારણોસર વેબ બ્રાઉઝર્સ તમારા ફોનના SMS સંદેશાઓ સીધા વાંચી શકતા નથી। "ફોન SMS વાંચો" બટન ફક્ત Chrome Android 84+ પર અને ફક્ત OTP-શૈલીના સંદેશાઓ માટે કામ કરે છે।\n\n✅ શ્રેષ્ઠ પદ્ધતિ: તમારા ફોનમાંથી કોઈપણ SMS સંદેશની નકલ કરો અને ઉપર "ક્લિપબોર્ડમાંથી પેસ્ટ કરો" બટન ટેપ કરો। આ બધા ઉપકરણો પર કામ કરે છે!',
      bho: 'गोपनीयता आ सुरक्षा कारण से वेब ब्राउज़र सीधे राउर फोन के SMS संदेश ना पढ़ सकत। "फोन SMS पढ़ीं" बटन बस Chrome Android 84+ पर आ बस OTP-शैली के संदेश खातिर काम करेला।\n\n✅ सबसे बढ़िया तरीका: आपन फोन से कवनो SMS संदेश कॉपी करीं आ ऊपर "क्लिपबोर्ड से पेस्ट करीं" बटन टैप करीं। ई सब डिवाइस पर काम करेला!',
      hne: 'गोपनीयता अर सुरक्षा कारणां तै वेब ब्राउज़र सीधे थारे फोन के SMS संदेश नी पढ़ सकै। "फोन SMS पढ़ो" बटन बस Chrome Android 84+ पै अर बस OTP-शैली के संदेश खातिर काम करै है।\n\n✅ सबतै बढ़िया तरीका: आपणे फोन तै कोए SMS संदेश कॉपी करो अर ऊपर "क्लिपबोर्ड तै पेस्ट करो" बटन टैप करो। यो सारे डिवाइस पै काम करै है!',
    },
  };
  
  return translations[key]?.[language] || translations[key]?.['en'] || key;
};

export function SMSScanner({ language, onScan }: SMSScannerProps) {
  const [sender, setSender] = useState('');
  const [content, setContent] = useState('');
  const [result, setResult] = useState<SMSMessage | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [smsAccessAvailable, setSmsAccessAvailable] = useState(false);
  const [isRequestingSMS, setIsRequestingSMS] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  useEffect(() => {
    // Check if SMS access is available
    if ('OTPCredential' in window) {
      setSmsAccessAvailable(true);
    }
  }, []);

  const requestSMSAccess = async () => {
    setIsRequestingSMS(true);
    
    try {
      if ('OTPCredential' in window) {
        const ac = new AbortController();
        
        // Show info message
        toast.info(
          language === 'hi' 
            ? '⏳ नया OTP SMS प्राप्त होने की प्रतीक्षा कर रहे हैं... (60 सेकंड)' 
            : '⏳ Waiting for new OTP SMS to arrive... (60 seconds)',
          { duration: 5000 }
        );
        
        // Timeout after 60 seconds
        const timeoutId = setTimeout(() => {
          ac.abort();
          toast.error(
            language === 'hi'
              ? '⏱️ समय समाप्त। कृपया SMS को मैन्युअल रूप से कॉपी-पेस्ट करें।'
              : '⏱️ Timeout. Please copy-paste the SMS manually.',
            { duration: 5000 }
          );
        }, 60000);

        const otpCredential: any = await navigator.credentials.get({
          // @ts-ignore
          otp: { transport: ['sms'] },
          signal: ac.signal
        });

        clearTimeout(timeoutId);

        if (otpCredential && otpCredential.code) {
          setContent(otpCredential.code);
          toast.success(
            language === 'hi' ? '✅ SMS प्राप्त हुआ!' : '✅ SMS received!'
          );
        }
      } else {
        toast.warning(
          language === 'hi'
            ? '❌ यह ब्राउज़र SMS पढ़ना सपोर्ट नहीं करता। कृपया कॉपी-पेस्ट करें।'
            : '❌ This browser does not support SMS reading. Please copy-paste.',
          { duration: 5000 }
        );
      }
    } catch (error: any) {
      console.error('SMS access error:', error);
      
      if (error.name === 'AbortError') {
        // Timeout already handled above
        return;
      }
      
      if (error.name === 'NotAllowedError') {
        toast.error(
          language === 'hi'
            ? '🚫 SMS पहुंच अनुमति अस्वीकृत। कृपया कॉपी-पेस्ट करें।'
            : '🚫 SMS access permission denied. Please copy-paste.',
          { duration: 5000 }
        );
      } else {
        toast.error(
          language === 'hi'
            ? '❌ SMS पढ़ना विफल। कृपया मैन्युअल रूप से पेस्ट करें।'
            : '❌ SMS reading failed. Please paste manually.',
          { duration: 5000 }
        );
      }
    } finally {
      setIsRequestingSMS(false);
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setContent(text);
        toast.success(
          language === 'hi' 
            ? 'क्लिपबोर्ड से पेस्ट किया गया' 
            : 'Pasted from clipboard'
        );
      }
    } catch (error) {
      toast.error(
        language === 'hi'
          ? 'क्लिपबोर्ड पहुंच अस्वीकृत'
          : 'Clipboard access denied'
      );
    }
  };

  const handleScan = () => {
    if (!content.trim()) {
      toast.error(
        language === 'hi' 
          ? 'कृपया SMS संदेश दर्ज करें' 
          : 'Please enter SMS message'
      );
      return;
    }

    setIsScanning(true);

    setTimeout(() => {
      const analysis = analyzeSMS(sender.trim() || 'Unknown', content);
      console.log('=== SCAN COMPLETE ===');
      console.log('Result:', analysis);
      
      setResult(analysis);
      onScan(analysis);
      setIsScanning(false);

      // Show success message
      toast.success(
        language === 'hi'
          ? `स्कैन पूर्ण: ${analysis.fraudScore}% जोखिम`
          : `Scan complete: ${analysis.fraudScore}% risk`
      );

      if (analysis.fraudScore >= 60) {
        console.log('Voice Alert:', getAlertMessage(language, analysis.fraudScore));
      }
    }, 1500);
  };

  const handleScanWithAutoRead = async () => {
    // First, try to auto-read SMS if available
    if (!content.trim() && smsAccessAvailable) {
      setIsRequestingSMS(true);
      
      try {
        if ('OTPCredential' in window) {
          const ac = new AbortController();
          
          // Set timeout for 3 seconds
          setTimeout(() => ac.abort(), 3000);

          const otpCredential: any = await navigator.credentials.get({
            // @ts-ignore
            otp: { transport: ['sms'] },
            signal: ac.signal
          });

          if (otpCredential && otpCredential.code) {
            setContent(otpCredential.code);
            setIsRequestingSMS(false);
            // Now scan
            setTimeout(() => handleScan(), 500);
            return;
          }
        }
      } catch (error: any) {
        console.log('Auto SMS read not available, proceeding with manual content');
      }
      
      setIsRequestingSMS(false);
    }
    
    // If content exists or auto-read failed, just scan
    handleScan();
  };

  const handleClear = () => {
    setSender('');
    setContent('');
    setResult(null);
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { 
      label: tr('criticalDanger', language), 
      color: 'bg-red-600', 
      textColor: 'text-red-700 dark:text-red-300', 
      bgColor: 'bg-red-100 dark:bg-red-950/30 border-red-300 dark:border-red-800',
      icon: AlertTriangle,
    };
    if (score >= 60) return { 
      label: tr('highRisk', language), 
      color: 'bg-red-500', 
      textColor: 'text-red-600 dark:text-red-400', 
      bgColor: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900',
      icon: AlertTriangle,
    };
    if (score >= 40) return { 
      label: tr('suspicious', language), 
      color: 'bg-orange-500', 
      textColor: 'text-orange-600 dark:text-orange-400', 
      bgColor: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900',
      icon: Info,
    };
    if (score >= 20) return { 
      label: tr('beCareful', language), 
      color: 'bg-yellow-500', 
      textColor: 'text-yellow-600 dark:text-yellow-400', 
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900',
      icon: Info,
    };
    return { 
      label: tr('safe', language), 
      color: 'bg-green-500', 
      textColor: 'text-green-600 dark:text-green-400', 
      bgColor: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900',
      icon: CheckCircle,
    };
  };

  const tips = getFraudTips(language);

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="text-center">
        <div className="inline-flex p-4 bg-gradient-to-br from-primary/10 to-yellow-500/10 rounded-2xl mb-4">
          <Scan className="w-8 h-8 text-primary" />
        </div>
        <h1 className="mb-2">{t('scanSMS', language)}</h1>
        <p className="text-muted-foreground">{t('welcomeDesc', language)}</p>
      </div>

      <Card className="p-6 border-yellow-200 dark:border-yellow-900/30 bg-gradient-to-br from-card to-yellow-50/20 dark:to-yellow-950/10">
        <div className="space-y-4">
          <div>
            <label className="text-sm mb-2 block flex items-center gap-2">
              {t('senderName', language)}
              <span className="text-xs text-muted-foreground">({tr('optional', language)})</span>
            </label>
            <Input
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder={tr('senderPlaceholder', language)}
              className="border-yellow-200 dark:border-yellow-900/30"
            />
          </div>

          <div>
            <label className="text-sm mb-2 block flex items-center gap-2">
              {t('enterMessage', language)} <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={tr('messagePlaceholder', language)}
              rows={6}
              className="border-yellow-200 dark:border-yellow-900/30 text-base"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleScan}
              disabled={!content.trim() || isScanning}
              className="flex-1 bg-gradient-to-r from-primary to-primary/90 h-12"
            >
              {isScanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {tr('scanning', language)}
                </>
              ) : (
                <>
                  <Scan className="w-5 h-5 mr-2" />
                  {t('analyze', language)}
                </>
              )}
            </Button>
            
            {result && (
              <Button
                onClick={handleClear}
                variant="outline"
                className="border-yellow-200 dark:border-yellow-900/30 h-12"
              >
                {tr('clearResults', language)}
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={pasteFromClipboard}
              variant="outline"
              className="flex-1 border-yellow-300 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/30 hover:bg-yellow-100 dark:hover:bg-yellow-950/50 h-11"
            >
              <Copy className="w-4 h-4 mr-2" />
              {t('pasteFromClipboard', language)}
            </Button>
            
            {smsAccessAvailable && (
              <Button
                onClick={requestSMSAccess}
                variant="outline"
                disabled={isRequestingSMS}
                className="flex-1 border-yellow-200 dark:border-yellow-900/30 h-11"
              >
                {isRequestingSMS ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Smartphone className="w-4 h-4 mr-2" />
                )}
                {t('requestSMS', language)}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Result Display */}
      {result && (
        <Card className={`p-6 border-2 ${getRiskLevel(result.fraudScore).bgColor}`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {React.createElement(getRiskLevel(result.fraudScore).icon, {
                  className: `w-8 h-8 ${getRiskLevel(result.fraudScore).textColor}`
                })}
                <div>
                  <h3 className={getRiskLevel(result.fraudScore).textColor}>
                    {getRiskLevel(result.fraudScore).label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('fraudScore', language)}: {result.fraudScore}%
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-4xl ${getRiskLevel(result.fraudScore).textColor}`}>
                  {result.fraudScore}%
                </div>
              </div>
            </div>

            <Progress value={result.fraudScore} className="h-3" />

            {result.reasons && result.reasons.length > 0 && (
              <div>
                <h4 className="mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {t('reasons', language)}
                </h4>
                <ul className="space-y-1 text-sm">
                  {result.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Safety Tips */}
      <Card className="p-6 bg-gradient-to-br from-card to-primary/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h3>{t('safetyTips', language)}</h3>
        </div>
        <ul className="space-y-2 text-sm">
          {tips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}