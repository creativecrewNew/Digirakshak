import React, { useState, useEffect, useRef } from 'react';
import { Scan, AlertTriangle, CheckCircle, Info, Shield, Smartphone, Copy, Camera, Upload, X, Image as ImageIcon, Bell, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Language, SMSMessage } from '../types';
import { analyzeSMS, getAlertMessage, getFraudTips } from '../utils/fraudDetection';
import { t } from '../utils/translations';
import { toast } from 'sonner@2.0.3';
import Tesseract from 'tesseract.js';

interface SMSScannerProps {
  language: Language;
  onScan: (message: SMSMessage) => void;
}

const translations = {
  takePhoto: {
    en: 'Take Photo',
    hi: 'फ़ोटो लें',
    pa: 'ਫੋਟੋ ਲਓ',
    ta: 'புகைப்படம் எடு',
    te: 'ఫోటో తీయండి',
    kn: 'ಫೋಟೋ ತೆಗೆಯಿರಿ',
    ml: 'ഫോട്ടോ എടുക്കുക',
    bn: 'ছবি তুলুন',
    gu: 'ફોટો લો',
    bho: 'फोटो लीं',
    hne: 'फोटो लेओ',
  },
  uploadImage: {
    en: 'Upload Image',
    hi: 'छवि अपलोड करें',
    pa: 'ਚਿੱਤਰ ਅਪਲੋਡ ਕਰੋ',
    ta: 'பட்டப் பதிவேற்றவும்',
    te: 'చిత్రాన్ని అప్‌లోడ్ చేయండి',
    kn: 'ಚಿತ್ರ ಅಪ್‌లోড್ ಮಾಡಿ',
    ml: 'ചിത്രം അപ്‌ലോഡ് ചെയ്യുക',
    bn: 'ছবি আপলোড করুন',
    gu: 'છબી અપલોડ કરો',
    bho: 'फोटो अपलोड करीं',
    hne: 'फोटो अपलोड करो',
  },
  capturePhoto: {
    en: 'Capture Photo',
    hi: 'फ़ोटो कैप्चर करें',
    pa: 'ਫੋਟੋ ਕੈਪਚਰ ਕਰੋ',
    ta: 'புகைப்படம் பிடி',
    te: 'ఫోటో క్యాప్చర్ చేయండి',
    kn: 'ಫೋಟೋ ಕ్యాప్చర್ ಮಾಡಿ',
    ml: 'ഫോട്ടോ ക്യാപ്ചർ ചെയ്യുക',
    bn: 'ছবি ক্যাপচার করুন',
    gu: 'ફોટો કેપ્ચર કરો',
    bho: 'फोटो कैपचर करीं',
    hne: 'फोटो कैपचर करो',
  },
  retake: {
    en: 'Retake',
    hi: 'पुनः लें',
    pa: 'ਦੁਬਾਰਾ ਲਓ',
    ta: 'மீண்டும் எடு',
    te: 'మళ్లీ తీయండి',
    kn: 'ಮತ್ತೆ ತೆಗೆಯಿರಿ',
    ml: 'വീണ്ടും എടുക്കുക',
    bn: 'আবার তুলুন',
    gu: 'ફરીથી લો',
    bho: 'फिन से लीं',
    hne: 'फेर तै लेओ',
  },
  useThis: {
    en: 'Use This',
    hi: 'इसे उपयोग करें',
    pa: 'ਇਸਨੂੰ ਵਰਤੋ',
    ta: 'இதைப் பயன்படுத்து',
    te: 'ఇది ఉపయోగించండి',
    kn: 'ಇದನ್ನು ಬಳಸಿ',
    ml: 'ഇത് ഉപയോഗിക്കുക',
    bn: 'এটা ব্যবহার করুন',
    gu: 'આનો ઉપયોગ કરો',
    bho: 'एकरा इस्तेमाल करीं',
    hne: 'इसका इस्तेमाल करो',
  },
  processingImage: {
    en: 'Processing image...',
    hi: 'छवि प्रसंस्करण...',
    pa: 'ਚਿੱਤਰ ਪ੍ਰਕਿਰਿਆ ਕਰ ਰਿਹਾ ਹੈ...',
    ta: 'படம் செயலாக்குகிறது...',
    te: 'చిత్రాన్ని ప్రాసెస్ చేస్తోంది...',
    kn: 'ಚಿತ್ರ ಪ್ರಕ್રಿೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...',
    ml: 'ചിത്രം പ്രോസസ്സ് ചെയ്യുന്നു...',
    bn: 'ছবি প্রসেস করা হচ্ছে...',
    gu: 'છબી પ્રક્રિયા કરી રહ્યું છે...',
    bho: 'फोटो प्रोसेस हो रहल बा...',
    hne: 'फोटो प्रोसेस हो रहा है...',
  },
  extractingText: {
    en: 'Extracting text from image...',
    hi: 'छवि से पाठ निकाल रहे हैं...',
    pa: 'ਚਿੱਤਰ ਤੋਂ ਟੈਕਸਟ ਕੱਢ ਰਿਹਾ ਹੈ...',
    ta: 'படத்தில் இருந்து உரையை எடுக்கிறது...',
    te: 'చిత్రం నుండి టెక్స్ట్ తీస్తోంది...',
    kn: 'ಚಿತ್ರದಿಂದ ಪಠ್ಯ ಹೊರತೆಗೆಯಲಾಗುತ್ತಿದೆ...',
    ml: 'ചിത്രത്തിൽ നിന്ന് വാചകം എടുക്കുന്നു...',
    bn: 'ছবি থেকে টেক্সট বের করা হচ্ছে...',
    gu: 'છબીમાંથી ટેક્સ્ટ કાઢી રહ્યું છે...',
    bho: 'फोटो से टेक्स्ट निकाल रहल बानी...',
    hne: 'फोटो तै टेक्स्ट निकाल रहे हैं...',
  },
  textExtracted: {
    en: 'Text extracted successfully!',
    hi: 'पाठ सफलतापूर्वक निकाला गया!',
    pa: 'ਟੈਕਸਟ ਸਫਲਤਾਪੂਰਵਕ ਕੱਢਿਆ ਗਿਆ!',
    ta: 'உரை வெற்றிகரமாக எடுக்கப்பட்டது!',
    te: 'టెక్స్ట్ విజయవంతంగా తీసింది!',
    kn: 'ಪಠ್ಯ ಯशಸ್ವಿಯಾಗಿ ಹೊರತೆಗೆಯಲಾಗಿದೆ!',
    ml: 'വാചകം വിജയകരമായി എടുത്തു!',
    bn: 'টেক্সট সফলভাবে বের করা হয়েছে!',
    gu: 'ટેક્સ્ટ સફળતાપૂર્વક કઢાયો!',
    bho: 'टेक्स्ट सफलतापूर्वक निकाल लेहल!',
    hne: 'टेक्स्ट सफलतापूर्वक निकाल लिया!',
  },
  noTextFound: {
    en: 'No text found in image',
    hi: 'छवि में कोई पाठ नहीं मिला',
    pa: 'ਚਿੱਤਰ ਵਿੱਚ ਕੋਈ ਟੈਕਸਟ ਨਹੀਂ ਮਿਲਿਆ',
    ta: 'படத்தில் எந்த உரையும் இல்லை',
    te: 'చిత్రంలో టెక్స్ట్ కనుగొనబడలేదు',
    kn: 'ಚಿತ್ರದಲ್ಲಿ ಯಾವುದೇ ಪಠ್ಯ ಕಂಡುಬಂದಿಲ್ಲ',
    ml: 'ചിത്രത്തിൽ വാചകം കണ്ടെത്തിയില്ല',
    bn: 'ছবितে কোনো টেক্সট পাওয়া যায়নি',
    gu: 'છબીમાં કોઈ ટેક્સ્ટ મળ્યો નહીં',
    bho: 'फोटो में कोई टेक्स्ट ना मिलल',
    hne: 'फोटो म्ह कोई टेक्स्ट नी मिल्या',
  },
  cameraNotSupported: {
    en: 'Camera not available on this device',
    hi: 'इस उपकरण पर कैमरा उपलब्ध नहीं है',
    pa: 'ਇਸ ਡਿਵਾਈਸ ਤੇ ਕੈਮਰਾ ਉਪਲਬਧ ਨਹੀਂ',
    ta: 'இந்த சாதனத்தில் கேமரா கிடைக்கவில்லை',
    te: 'ఈ పరికరంలో కెమెరా అందుబాటుల�� లేదు',
    kn: 'ಈ ಸಾಧನದಲ್ಲಿ ಕ್ಮೆರಾ ಲಭ್ಯವಿಲ್ಲ',
    ml: 'ഈ ഉപകരണത്തിൽ ക്യാമറ ലഭ്യമല്ല',
    bn: 'এই ডিভাইসে ক্যামেরা পাওয়া যায় না',
    gu: 'આ ઉપકરણ પર કેમેરા ઉપલબ્ધ નથી',
    bho: 'ए डिवाइस पर कैमरा उपलब्ध नइखे',
    hne: 'इस डिवाइस पै कैमरा उपलब्ध नी है',
  },
  listenToNotification: {
    en: 'Listen to Notification',
    hi: 'सूचना सुनें',
    pa: 'ਸੂਚਨਾ ਸੁਣੋ',
    ta: 'अறिविप்பைக் கேளுங்கள்',
    te: 'నోటిఫికేషన్ వినండి',
    kn: 'ಅಧಿಸೂಚನೆ ಕೇಳಿ',
    ml: 'അറിയിപ്പ് കേൾക്കുക',
    bn: 'বিজ্ঞপ্তি শুনুন',
    gu: 'સૂચના સાંભળો',
    bho: 'सूचना सुनीं',
    hne: 'सूचना सुनो',
  },
  listeningForNotification: {
    en: 'Listening for all notifications...',
    hi: 'सभी सूचनाओं के लिए सुन रहे हैं...',
    pa: 'ਸਾਰੀਆਂ ਸੂਚਨਾਵਾਂ ਲਈ ਸੁਣ ਰਿਹਾ ਹੈ...',
    ta: 'எல்லா அறிவிப்புகளுக்காகவும் கேட்கிறது...',
    te: 'అన్ని నోటిఫికేషన్ల కోసం వింటోంది...',
    kn: 'ಎಲ್ಲಾ ಅಧಿಸೂಚನೆಗಳಿಗಾಗಿ ಕೇಳುತ್ತಿದೆ...',
    ml: 'എല்லാ അറിയിപ്പുകൾക്കുമായി കേൾക്കുന്നു...',
    bn: 'সমস্ত বিজ্ঞপ্তির জন্য শোনছে...',
    gu: 'બધી સૂચનાઓ માટે સાંભળી રહ્યું છે...',
    bho: 'सब सूचना खातिर सुन रहल बानी...',
    hne: 'सब सूचना के खातिर सुन रहे हैं...',
  },
  stopListening: {
    en: 'Stop Listening',
    hi: 'सुनना बंद करें',
    pa: 'ਸੁਣਨਾ ਬੰਦ ਕਰੋ',
    ta: 'கேட்பதை நிறுத்து',
    te: 'వినడం ఆపండి',
    kn: 'ಕೇಳುವುದನ್ನು ನಿಲ್ಲಿಸಿ',
    ml: 'കേൾക്കുന്നത് നിർത്തുക',
    bn: 'শোনা বন্ধ করুন',
    gu: 'સાંભળવાનું બંધ કરો',
    bho: 'सुनल बंद करीं',
    hne: 'सुनना बंद करो',
  },
  pasteFullMessage: {
    en: '💡 Paste entire message for higher accuracy',
    hi: '💡 अधिक सटीकता के लिए पूरा संदेश पेस्ट करें',
    pa: '💡 ਉੱਚ ਸਟੀਕਤਾ ਲਈ ਪੂਰਾ ਸੰਦੇਸ਼ ਪੇਸਟ ਕਰੋ',
    ta: '💡 அதிக தुल்லியत்திற்காக முழு செய்தியையும் ஒட்டவும்',
    te: '💡 అధిక ఖచ్చితత్వం కోసం పూర్తి సందేశాన్ని అతికించండి',
    kn: '💡 ಹೆಚ್ಚಿನ ನಿಖರತೆಗಾಗಿ ಸಂಪೂರ್ಣ ಸಂದೇಶವನ್ನು ಅಂಟಿಸಿ',
    ml: '💡 കൂടുതൽ കൃത്യതയ്ക്കായി മുഴുവൻ സന്ദേശവും ഒട്ടിക്കുക',
    bn: '💡 উচ্চতর নির্ভুলতার জন্য সম্পূর্ণ বার্তা পেস্ট করুন',
    gu: '💡 વધુ ચોકસાઈ માટે સંપૂર્ણ સંદેશ પેસ્ટ કરો',
    bho: '💡 बेहतर सटीकता खातिर पूरा संदेश पेस्ट करीं',
    hne: '💡 बेहतर सटीकता के खातिर पूरा संदेश पेस्ट करो',
  },
};

const tr = (key: keyof typeof translations, lang: Language): string => {
  return translations[key]?.[lang] || translations[key]?.['en'] || key;
};

// Universal notification type detector
const detectNotificationType = (text: string): {
  type: 'sms' | 'email' | 'call' | 'whatsapp' | 'banking' | 'otp' | 'url' | 'unknown';
  icon: string;
  label: { en: string; hi: string };
} => {
  const lowerText = text.toLowerCase();
  
  // Email detection
  if (lowerText.includes('subject:') || lowerText.includes('from:') || 
      lowerText.includes('@') && (lowerText.includes('dear') || lowerText.includes('regards'))) {
    return { 
      type: 'email', 
      icon: '📧', 
      label: { en: 'Email', hi: 'ईमेल' } 
    };
  }
  
  // Call log detection
  if ((lowerText.includes('call') || lowerText.includes('कॉल') || lowerText.includes('missed') || 
      lowerText.includes('incoming') || lowerText.includes('outgoing')) && 
      /\+?\d{10,}/.test(text)) {
    return { 
      type: 'call', 
      icon: '📞', 
      label: { en: 'Call Log', hi: 'कॉल लॉग' } 
    };
  }
  
  // WhatsApp/Telegram detection
  if (lowerText.includes('whatsapp') || lowerText.includes('telegram') || 
      lowerText.includes('wa.me') || lowerText.includes('t.me')) {
    return { 
      type: 'whatsapp', 
      icon: '💬', 
      label: { en: 'Messaging App', hi: 'मैसेजिंग ऐप' } 
    };
  }
  
  // Banking app detection
  if (lowerText.includes('bank') || lowerText.includes('बैंक') || 
      lowerText.includes('account') || lowerText.includes('खाता') ||
      lowerText.includes('balance') || lowerText.includes('transaction') ||
      lowerText.includes('paytm') || lowerText.includes('phonepe') ||
      lowerText.includes('gpay') || lowerText.includes('upi')) {
    return { 
      type: 'banking', 
      icon: '🏦', 
      label: { en: 'Banking/Payment', hi: 'बैंकिंग/भुगतान' } 
    };
  }
  
  // OTP detection
  if (/\b\d{4,6}\b/.test(text) && (lowerText.includes('otp') || lowerText.includes('code') || 
      lowerText.includes('verification') || lowerText.includes('verify'))) {
    return { 
      type: 'otp', 
      icon: '🔐', 
      label: { en: 'OTP/Verification', hi: 'OTP/सत्यापन' } 
    };
  }
  
  // URL/Link detection
  if (lowerText.includes('http') || lowerText.includes('www.') || lowerText.includes('click here') ||
      lowerText.includes('यहाँ क्लिक करें')) {
    return { 
      type: 'url', 
      icon: '🔗', 
      label: { en: 'Link/URL', hi: 'लिंक/URL' } 
    };
  }
  
  // Default SMS
  return { 
    type: 'sms', 
    icon: '📱', 
    label: { en: 'SMS/Message', hi: 'SMS/संदेश' } 
  };
};

export function SMSScannerWithCamera({ language, onScan }: SMSScannerProps) {
  const [sender, setSender] = useState('');
  const [content, setContent] = useState('');
  const [result, setResult] = useState<SMSMessage | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [smsAccessAvailable, setSmsAccessAvailable] = useState(false);
  const [isRequestingSMS, setIsRequestingSMS] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isSecureContext, setIsSecureContext] = useState(true);
  const [isListeningForNotification, setIsListeningForNotification] = useState(false);
  const [showPasteHint, setShowPasteHint] = useState(false);
  const [lastClipboardContent, setLastClipboardContent] = useState('');
  const [showClipboardHelp, setShowClipboardHelp] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null); // Separate ref for camera capture
  const streamRef = useRef<MediaStream | null>(null);
  const clipboardIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastScanTimeRef = useRef<number>(0); // Cooldown tracker
  const lastClipboardContentRef = useRef<string>(''); // Use ref to avoid closure issues

  useEffect(() => {
    if ('OTPCredential' in window) {
      setSmsAccessAvailable(true);
    }
    
    // Detect mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      return mobileRegex.test(userAgent.toLowerCase()) || window.innerWidth <= 768;
    };
    setIsMobileDevice(checkMobile());
    
    // Check if running in secure context (HTTPS or localhost)
    const isSecure = window.isSecureContext || window.location.protocol === 'https:' || 
                     window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';
    setIsSecureContext(isSecure);
    
    if (!isSecure) {
      console.warn('Camera features require HTTPS. Current protocol:', window.location.protocol);
    }
    
    // Cleanup camera stream on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      // Cleanup clipboard monitoring
      if (clipboardIntervalRef.current) {
        clearInterval(clipboardIntervalRef.current);
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(null); // Clear any previous errors
      
      // Check if mediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const errorMsg = language === 'hi' 
          ? 'कैमरा इस ब्राउज़र में समर्थित नहीं है। कृपया एक आधुनिक ब्राउज़र का उपयोग करें।'
          : 'Camera is not supported in this browser. Please use a modern browser.';
        setCameraError(errorMsg);
        toast.error(errorMsg, { duration: 5000 });
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setShowCamera(true);
        toast.success(language === 'hi' ? 'कैमरा शुरू हो गया' : 'Camera started', { duration: 2000 });
      }
    } catch (error: any) {
      console.error('Camera error:', error);
      
      let errorMsg = '';
      let errorTitle = '';
      
      // Handle different error types
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorTitle = language === 'hi' ? '📷 कैमरा अनुमति अस्वीकृत' : '📷 Camera Permission Denied';
        errorMsg = language === 'hi' 
          ? 'कैमरा एक्सेस करने के लिए:\n\n1. अपने ब्राउज़र सेटिंग्स खोलें\n2. इस साइट को कैमरा अनुमति दें\n3. पेज को रिफ्रेश करें और पुनः प्रयास करें\n\n💡 वैकल्पिक रूप से, "छवि अपलोड करें" बटन का उपयोग करें'
          : 'To enable camera access:\n\n1. Open your browser settings\n2. Allow camera permission for this site\n3. Refresh the page and try again\n\n💡 Alternatively, use the "Upload Image" button';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorTitle = language === 'hi' ? '📷 कैमरा नहीं मिला' : '📷 Camera Not Found';
        errorMsg = language === 'hi'
          ? 'कोई कैमरा डिवाइस नहीं मिला। कृपया:\n\n1. सुनिश्चित करें कि कैमरा कनेक्ट है\n2. "छवि अपलोड करें" बटन का उपयोग करें'
          : 'No camera device found. Please:\n\n1. Ensure camera is connected\n2. Use the "Upload Image" button instead';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorTitle = language === 'hi' ? '📷 कैमरा उपयोग में है' : '📷 Camera In Use';
        errorMsg = language === 'hi'
          ? 'कैमरा किसी अन्य ऐप द्वारा उपयोग में है। कृपया:\n\n1. अन्य ऐप्स बंद करें\n2. पुनः प्रयास करें'
          : 'Camera is being used by another app. Please:\n\n1. Close other apps\n2. Try again';
      } else if (error.name === 'OverconstrainedError') {
        errorTitle = language === 'hi' ? '📷 कैमरा समर्थित नहीं' : '📷 Camera Not Supported';
        errorMsg = language === 'hi'
          ? 'आपका कैमरा आवश्यकताओं को पूरा नहीं करता। "छवि अपलोड करें" का उपयोग करें।'
          : 'Your camera does not meet requirements. Use "Upload Image" instead.';
      } else {
        errorTitle = language === 'hi' ? '📷 कैमरा त्रुटि' : '📷 Camera Error';
        errorMsg = language === 'hi'
          ? 'कैमरा एक्सेस करने में त्रुटि। "छवि अपलोड करें" बटन का उपयोग करें।'
          : 'Error accessing camera. Use "Upload Image" button instead.';
      }
      
      setCameraError(errorMsg);
      toast.error(errorTitle, {
        description: errorMsg,
        duration: 10000,
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target?.result as string;
        setCapturedImage(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractTextFromImage = async (imageData: string) => {
    setIsProcessingImage(true);
    setOcrProgress(0);
    
    try {
      toast.info(tr('extractingText', language), { duration: 2000 });
      
      // Optimized Tesseract settings for faster and more accurate processing
      const result = await Tesseract.recognize(imageData, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const progress = Math.round(m.progress * 100);
            setOcrProgress(progress);
            console.log(`OCR Progress: ${progress}%`);
          }
        },
        // Optimize for speed and accuracy
        tessedit_pageseg_mode: Tesseract.PSM.AUTO,
        preserve_interword_spaces: '1',
      });

      let extractedText = result.data.text.trim();
      
      if (extractedText) {
        // Clean up the extracted text for better readability
        extractedText = extractedText
          // Remove excessive line breaks (more than 2)
          .replace(/\n{3,}/g, '\n\n')
          // Remove excessive spaces
          .replace(/ {2,}/g, ' ')
          // Fix common OCR errors
          .replace(/[|]/g, 'I')  // Vertical bars often misread as I
          .replace(/[`´'']/g, "'") // Fix quote variations
          .replace(/[""]/g, '"')   // Fix double quote variations
          // Trim each line
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .join('\n');
        
        setContent(extractedText);
        setCapturedImage(null);
        
        toast.success(tr('textExtracted', language), {
          description: language === 'hi' 
            ? `${extractedText.length} अक्षर निकाले गए - स्कैन जारी है...`
            : `${extractedText.length} characters extracted - scanning...`,
          duration: 3000,
        });
        
        // Auto-scan the extracted text after brief delay
        setTimeout(() => {
          const analysis = analyzeSMS('Unknown', extractedText);
          setResult(analysis);
          onScan(analysis);
          
          const riskLevel = getRiskLevel(analysis.fraudScore);
          toast.success(
            language === 'hi' 
              ? `स्कैन पूर्ण: ${riskLevel.label}` 
              : `Scan complete: ${riskLevel.label}`,
            {
              description: language === 'hi'
                ? `धोखाधड़ी जोखिम: ${analysis.fraudScore}%`
                : `Fraud Risk: ${analysis.fraudScore}%`,
              duration: 5000,
            }
          );
        }, 800);
      } else {
        toast.error(tr('noTextFound', language), {
          description: language === 'hi'
            ? 'कृपया स्पष्ट छवि का प्रयास करें'
            : 'Please try a clearer image',
        });
      }
    } catch (error) {
      console.error('OCR error:', error);
      toast.error(language === 'hi' ? 'छवि से पाठ निकालने में त्रुटि' : 'Error extracting text from image', {
        description: language === 'hi'
          ? 'कृपया दूसरी छवि का प्रयास करें'
          : 'Please try another image',
      });
    } finally {
      setIsProcessingImage(false);
      setOcrProgress(0);
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setContent(text);
        setLastClipboardContent(text);
        toast.success(language === 'hi' ? 'क्लिपबोर्ड से पेस्ट किया गया' : 'Pasted from clipboard');
      }
    } catch (error) {
      toast.error(language === 'hi' ? 'क्लिपबोर्ड पहुंच अस्वीकृत' : 'Clipboard access denied');
    }
  };

  const handleListenToNotification = async () => {
    if (!isListeningForNotification) {
      // Start listening
      try {
        // Test if clipboard API is available (don't require content)
        if (!navigator.clipboard || !navigator.clipboard.readText) {
          toast.error(
            language === 'hi' ? '❌ क्लिपबोर्ड समर्थित नहीं है' : '❌ Clipboard not supported',
            {
              description: language === 'hi'
                ? 'आपका ब्राउज़र क्लिपबोर्ड एक्सेस का समर्थन नहीं करता। कृपया "📋 Paste from Clipboard" बटन का उपयोग करें।'
                : 'Your browser doesn\'t support clipboard access. Please use the "📋 Paste from Clipboard" button.',
              duration: 8000,
            }
          );
          return;
        }

        // Set listening state immediately
        setIsListeningForNotification(true);
        setShowPasteHint(false);

        // Request notification permission (optional)
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') {
            toast.info(
              language === 'hi' ? '💡 सूचना सुविधा वैकल्पिक है' : '💡 Notifications are optional',
              {
                description: language === 'hi'
                  ? 'हम अभी भी क्लिपबोर्ड की निगरानी करेंगे'
                  : 'We will still monitor clipboard',
                duration: 3000,
              }
            );
            // Continue anyway - notifications are optional
          }
        }
        
        // Show detailed instructions
        toast.success(
          language === 'hi' ? '🔔 सूचना निगरानी चालू' : '🔔 Notification Monitoring Active',
          {
            description: language === 'hi'
              ? '✅ किसी भी सूचना को कॉपी करें:\n\n📱 SMS\n📧 Email\n📞 Call Log\n💬 WhatsApp\n🏦 Banking\n\nहम तुरंत स्कैन करेंगे!'
              : '✅ Copy any notification:\n\n📱 SMS\n📧 Email\n📞 Call Log\n💬 WhatsApp\n🏦 Banking\n\nWe will scan instantly!',
            duration: 10000,
          }
        );

        // Show browser notification with instructions
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('DigiRakshak - ' + (language === 'hi' ? 'सभी सूचनाओं के लिए सुन रहे हैं' : 'Listening to All Notifications'), {
            body: language === 'hi' 
              ? '✅ SMS, Email, Call, WhatsApp - कुछ भी कॉपी करें!\n\nहम स्वचालित रूप से धोखाधड़ी के लिए स्कैन करेंगे।'
              : '✅ Copy SMS, Email, Call, WhatsApp - anything!\n\nWe will auto-scan for fraud.',
            icon: '/favicon.ico',
            requireInteraction: true,
          });
        }

        // Start monitoring clipboard every 6 seconds for rapid fraud detection
        clipboardIntervalRef.current = setInterval(async () => {
          try {
            const text = await navigator.clipboard.readText();
            
            // Check if clipboard content changed and looks like SMS
            if (text && text !== lastClipboardContentRef.current && text.length > 10) {
              // Cooldown check - prevent rapid-fire scans
              const currentTime = Date.now();
              if (currentTime - lastScanTimeRef.current < 5000) {
                // Too soon, skip this one
                console.log('Cooldown active, skipping scan...');
                return;
              }
              lastScanTimeRef.current = currentTime;
              
              lastClipboardContentRef.current = text;
              
              // Auto-fill and scan
              setSender('');
              setContent(text);
              
              // Detect notification type
              const notifType = detectNotificationType(text);
              
              // Perform analysis immediately
              const analysis = analyzeSMS('Unknown', text);
              setResult(analysis);
              onScan(analysis);
              setShowPasteHint(false); // Don't show hint anymore to reduce clutter
              
              // Get risk level
              const riskLevel = getRiskLevel(analysis.fraudScore);
              
              // Single consolidated toast notification
              toast.success(
                language === 'hi' 
                  ? `${notifType.icon} ${notifType.label.hi} - ${riskLevel.label}` 
                  : `${notifType.icon} ${notifType.label.en} - ${riskLevel.label}`,
                {
                  description: language === 'hi'
                    ? `धोखाधड़ी जोखिम: ${analysis.fraudScore}%`
                    : `Fraud Risk: ${analysis.fraudScore}%`,
                  duration: 5000,
                }
              );

              // Only show browser notification for HIGH RISK (60%+)
              if (analysis.fraudScore >= 60 && 'Notification' in window && Notification.permission === 'granted') {
                new Notification(
                  language === 'hi' ? `⚠️ ${riskLevel.label}` : `⚠️ ${riskLevel.label}`,
                  {
                    body: language === 'hi'
                      ? `धोखाधड़ी जोखिम: ${analysis.fraudScore}%\n\n${analysis.reasons[0] || 'संदिग्ध संदेश पाया गया'}`
                      : `Fraud Risk: ${analysis.fraudScore}%\n\n${analysis.reasons[0] || 'Suspicious message detected'}`,
                    icon: '/favicon.ico',
                    requireInteraction: true,
                  }
                );
              }
            }
          } catch (error) {
            // Silently fail - clipboard might not be accessible at this moment
            console.log('Clipboard monitoring - waiting for copy action...');
          }
        }, 6000); // Check every 6 seconds for rapid fraud detection
        
      } catch (error) {
        console.error('Error listening for notifications:', error);
        setIsListeningForNotification(false);
        
        toast.error(
          language === 'hi' ? '❌ क्लिपबोर्ड अनुमति आवश्यक' : '❌ Clipboard Permission Required',
          {
            description: language === 'hi'
              ? '🔒 कृपया ब्र��उज़र में क्लिपबोर्ड एक्सेस की नुमति दें:\n\n1️⃣ पता बार में 🔒 ताला आइकन क्लिक करें\n2️⃣ "अनुमतियां" या "साइट सेटिंग्स" चुनें\n3️⃣ "क्लिपबोर्ड" → "अनुमति दें" ✅'
              : '🔒 Please allow clipboard access in browser:\n\n1️⃣ Click 🔒 lock icon in address bar\n2️⃣ Select "Permissions" or "Site settings"\n3️⃣ Find "Clipboard" → Set to "Allow" ✅',
            duration: 10000,
          }
        );
      }
    } else {
      // Stop listening
      if (clipboardIntervalRef.current) {
        clearInterval(clipboardIntervalRef.current);
        clipboardIntervalRef.current = null;
      }
      setIsListeningForNotification(false);
      setShowPasteHint(false);
      setLastClipboardContent('');
      
      toast.info(
        language === 'hi' ? '🔕 सूचना सुनना बंद हो गया' : '🔕 Stopped listening for notifications',
        {
          description: language === 'hi' 
            ? 'SMS निगरानी बंद कर दी गई है'
            : 'SMS monitoring has been stopped',
          duration: 3000,
        }
      );
    }
  };

  const handleScan = () => {
    if (!content.trim()) {
      toast.error(language === 'hi' ? 'कृपया SMS संदेश दर्ज करें' : 'Please enter SMS message');
      return;
    }

    // Cooldown check
    const currentTime = Date.now();
    if (currentTime - lastScanTimeRef.current < 5000) {
      toast.error(language === 'hi' ? 'कृपया थोड़ा समय अपेक्षा करें' : 'Please wait a moment');
      return;
    }
    lastScanTimeRef.current = currentTime;

    setIsScanning(true);

    setTimeout(() => {
      const analysis = analyzeSMS(sender.trim() || 'Unknown', content);
      setResult(analysis);
      onScan(analysis);
      setIsScanning(false);

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

  const handleClear = () => {
    setSender('');
    setContent('');
    setResult(null);
    setCapturedImage(null);
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { 
      label: language === 'hi' ? 'गंभीर खतरा' : 'Critical Danger',
      color: 'bg-red-600', 
      textColor: 'text-red-700 dark:text-red-300', 
      bgColor: 'bg-red-100 dark:bg-red-950/30 border-red-300 dark:border-red-800',
      icon: AlertTriangle,
    };
    if (score >= 60) return { 
      label: language === 'hi' ? 'उच्च जोखिम' : 'High Risk',
      color: 'bg-red-500', 
      textColor: 'text-red-600 dark:text-red-400', 
      bgColor: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900',
      icon: AlertTriangle,
    };
    if (score >= 40) return { 
      label: language === 'hi' ? 'संदिग्ध' : 'Suspicious',
      color: 'bg-orange-500', 
      textColor: 'text-orange-600 dark:text-orange-400', 
      bgColor: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900',
      icon: Info,
    };
    if (score >= 20) return { 
      label: language === 'hi' ? 'सावधानी बरतें' : 'Be Careful',
      color: 'bg-yellow-500', 
      textColor: 'text-yellow-600 dark:text-yellow-400', 
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900',
      icon: Info,
    };
    return { 
      label: language === 'hi' ? 'सुरक्षित' : 'Safe',
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

      {/* Camera Modal */}
      {showCamera && (
        <Card className="p-4 bg-black">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg"
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={capturePhoto} className="flex-1">
                <Camera className="w-4 h-4 mr-2" />
                {tr('capturePhoto', language)}
              </Button>
              <Button onClick={stopCamera} variant="outline" className="flex-1">
                <X className="w-4 h-4 mr-2" />
                {t('cancel', language)}
              </Button>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </Card>
      )}

      {/* Captured Image Preview */}
      {capturedImage && !showCamera && (
        <Card className="p-4">
          <div className="space-y-4">
            <img src={capturedImage} alt="Captured SMS" className="w-full rounded-lg" />
            {isProcessingImage ? (
              <div className="space-y-3 py-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                  <div className="text-center">
                    <p className="font-medium text-primary">{tr('processingImage', language)}</p>
                    <p className="text-sm text-muted-foreground">
                      {ocrProgress > 0 
                        ? `${ocrProgress}% ${language === 'hi' ? 'पूर्ण' : 'Complete'}`
                        : language === 'hi' ? 'कृपया प्रतीक्षा करें...' : 'Please wait...'
                      }
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-primary to-yellow-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${Math.max(ocrProgress, 5)}%` }}
                  ></div>
                </div>
                {ocrProgress > 0 && (
                  <p className="text-xs text-center text-muted-foreground">
                    {language === 'hi' 
                      ? 'पाठ पहचान जारी है... कुछ सेकंड लग सकते हैं' 
                      : 'Text recognition in progress... may take a few seconds'
                    }
                  </p>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={() => extractTextFromImage(capturedImage)}
                  className="flex-1 bg-primary"
                  disabled={isProcessingImage}
                >
                  <Scan className="w-4 h-4 mr-2" />
                  {tr('useThis', language)}
                </Button>
                <Button
                  onClick={() => setCapturedImage(null)}
                  variant="outline"
                  className="flex-1"
                >
                  {tr('retake', language)}
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* HTTPS Warning Alert */}
      {!isSecureContext && (
        <Alert className="border-orange-200 dark:border-orange-900/30 bg-orange-50/50 dark:bg-orange-950/20">
          <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          <AlertDescription className="text-sm">
            <strong className="text-orange-700 dark:text-orange-300">
              {language === 'hi' ? '⚠️ कैमरा सुविधा उपलब्ध नहीं है' : '⚠️ Camera Feature Not Available'}
            </strong>
            <p className="mt-2">
              {language === 'hi' ? (
                <>
                  कैमरा एक्सेस के लिए HTTPS (सुरक्षित कनेक्शन) की आवश्यकता है। कृपया:<br/><br/>
                  <strong>✅ "छवि अपलोड करें" बटन का उपयोग करें</strong> - यह सभी साइट्स पर काम करता है!<br/><br/>
                  या अपने होस्टिंग प्रदाता से HTTPS सक्षम करने के लिए कहें।
                </>
              ) : (
                <>
                  Camera access requires HTTPS (secure connection). Please:<br/><br/>
                  <strong>✅ Use "Upload Image" button</strong> - works on all sites!<br/><br/>
                  Or ask your hosting provider to enable HTTPS for this website.
                </>
              )}
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Paste Full Message Hint */}
      {showPasteHint && result && (
        <Alert className="border-blue-500 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 animate-bounce">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <AlertDescription>
            <strong className="text-blue-700 dark:text-blue-300">
              {tr('pasteFullMessage', language)}
            </strong>
          </AlertDescription>
        </Alert>
      )}

      {/* Mobile Device Warning for Auto-Monitoring */}
      {isMobileDevice && (
        <Alert className="border-amber-500 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30">
          <Smartphone className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-sm">
            <strong className="text-amber-700 dark:text-amber-300">
              {language === 'hi' ? '📱 मोबाइल पर महत्वपूर्ण जानकारी' : '📱 Important Info for Mobile'}
            </strong>
            <p className="mt-2">
              {language === 'hi' ? (
                <>
                  <strong>\"सूचना सुनें\"</strong> फीचर मोबाइल ब्राउज़र में सीमित है।<br/><br/>
                  <strong>✅ इसके बजाय उपयोग करें:</strong><br/>
                  1️⃣ SMS/सूचना को <strong>लंबा दबाएं</strong> और <strong>कॉपी</strong> करें<br/>
                  2️⃣ <strong>\"📋 क्लिपबोर्ड से पेस्ट करें\"</strong> बटन क्लिक करें<br/><br/>
                  💡 <strong>या</strong> SMS की फोटो लें और AI टेक्स्ट निकालेगा!
                </>
              ) : (
                <>
                  <strong>\"Listen to Notification\"</strong> has limited support on mobile browsers.<br/><br/>
                  <strong>✅ Use instead:</strong><br/>
                  1️⃣ <strong>Long-press</strong> and <strong>Copy</strong> SMS/notification<br/>
                  2️⃣ Click <strong>\"📋 Paste from Clipboard\"</strong> button<br/><br/>
                  💡 <strong>Or</strong> take a photo of SMS and AI will extract text!
                </>
              )}
            </p>
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-4 sm:p-6 border-yellow-200 dark:border-yellow-900/30 bg-gradient-to-br from-card to-yellow-50/20 dark:to-yellow-950/10">
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="text-xs sm:text-sm mb-2 block flex items-center gap-2">
              <span className="truncate">{t('senderName', language)}</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">(Optional)</span>
            </label>
            <Input
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="e.g., SBIINB, +919876543210"
              className="border-yellow-200 dark:border-yellow-900/30 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="text-xs sm:text-sm mb-2 block flex items-center gap-2">
              <span className="truncate">{t('enterMessage', language)}</span>
              <span className="text-red-500 flex-shrink-0">*</span>
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={language === 'hi' ? 'SMS का पाठ यहां पेस्ट करें...' : 'Paste the SMS content here...'}
              rows={6}
              className="border-yellow-200 dark:border-yellow-900/30 text-sm sm:text-base"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2">
            {/* For mobile devices, use native camera capture; for desktop, use getUserMedia */}
            {isMobileDevice ? (
              <Button
                onClick={() => cameraInputRef.current?.click()}
                variant="outline"
                className="w-full border-primary/30 hover:bg-primary/10"
                disabled={isProcessingImage}
              >
                <Camera className="w-4 h-4 mr-2" />
                {tr('takePhoto', language)}
              </Button>
            ) : (
              <Button
                onClick={startCamera}
                variant="outline"
                className="w-full border-primary/30 hover:bg-primary/10"
                disabled={isProcessingImage || showCamera || !isSecureContext}
              >
                <Camera className="w-4 h-4 mr-2" />
                {tr('takePhoto', language)}
              </Button>
            )}
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full border-primary/30 hover:bg-primary/10"
              disabled={isProcessingImage}
            >
              <Upload className="w-4 h-4 mr-2" />
              {tr('uploadImage', language)}
            </Button>
            
            {/* Hidden file input for gallery upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            {/* Hidden camera input for direct camera capture on mobile */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <Button
              onClick={pasteFromClipboard}
              variant="outline"
              className="w-full border-yellow-300 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/30"
            >
              <Copy className="w-4 h-4 mr-2" />
              <span className="truncate">{t('pasteFromClipboard', language)}</span>
            </Button>
            
            <Button
              onClick={handleListenToNotification}
              variant="outline"
              className={`w-full ${isListeningForNotification 
                ? "border-red-500 bg-red-50 dark:bg-red-950/30 animate-pulse" 
                : "border-primary/30 hover:bg-primary/10 bg-primary/5"}`}
            >
              <Bell className={`w-4 h-4 mr-2 ${isListeningForNotification ? 'text-red-600' : ''}`} />
              <span className="truncate">{isListeningForNotification ? tr('stopListening', language) : tr('listenToNotification', language)}</span>
            </Button>
          </div>

          {/* Listen to Notification Help */}
          {!isListeningForNotification && (
            <Alert className="border-primary/20 bg-primary/5">
              <HelpCircle className="w-4 h-4 text-primary" />
              <AlertDescription className="text-xs">
                <strong>{language === 'hi' ? '💡 सूचना सुनना कैसे काम करता है:' : '💡 How Listen to Notification works:'}</strong>
                <br/>
                {language === 'hi' ? (
                  <>
                    1️⃣ "सूचना सुनें" क्लिक करें<br/>
                    2️⃣ SMS/Email/WhatsApp कॉपी करें<br/>
                    3️⃣ स्वचालित स्कैनिंग! 🚀
                  </>
                ) : (
                  <>
                    1️⃣ Click "Listen to Notification"<br/>
                    2️⃣ Copy SMS/Email/WhatsApp<br/>
                    3️⃣ Auto-scans instantly! 🚀
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Scan Button */}
          <div className="flex gap-2">
            <Button
              onClick={handleScan}
              disabled={!content.trim() || isScanning || isProcessingImage}
              className="flex-1 bg-gradient-to-r from-primary to-primary/90 h-12"
            >
              {isScanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {language === 'hi' ? 'स्कैन कर रहे हैं...' : 'Scanning...'}
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
                {language === 'hi' ? 'साफ़ करें' : 'Clear'}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Result Display */}
      {result && (
        <Card className={`p-4 sm:p-6 border-2 ${getRiskLevel(result.fraudScore).bgColor}`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                {React.createElement(getRiskLevel(result.fraudScore).icon, {
                  className: `w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 ${getRiskLevel(result.fraudScore).textColor}`
                })}
                <div className="min-w-0 flex-1">
                  <h3 className={`truncate ${getRiskLevel(result.fraudScore).textColor}`}>
                    {getRiskLevel(result.fraudScore).label}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {t('fraudScore', language)}: {result.fraudScore}%
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className={`text-2xl sm:text-4xl ${getRiskLevel(result.fraudScore).textColor}`}>
                  {result.fraudScore}%
                </div>
              </div>
            </div>

            <Progress value={result.fraudScore} className="h-3" />

            {result.reasons && result.reasons.length > 0 && (
              <div>
                <h4 className="mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{t('reasons', language)}</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm">
                  {result.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5 flex-shrink-0">•</span>
                      <span className="break-words">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Safety Tips */}
      <Card className="p-4 sm:p-6 bg-gradient-to-br from-card to-primary/5">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <h3 className="truncate">{t('safetyTips', language)}</h3>
        </div>
        <ul className="space-y-2 text-xs sm:text-sm">
          {tips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-primary mt-0.5 flex-shrink-0">•</span>
              <span className="break-words">{tip}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Tip Alert */}
      <Alert className="border-blue-200 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/20">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-sm">
          <strong>{language === 'hi' ? 'नई सुविधा' : 'New Feature'}:</strong>{' '}
          {language === 'hi' 
            ? 'अब आप अपने फोन पर SMS की फोटो खींच सकते हैं या अपलोड कर सकते हैं! AI स्वचालित रूप से टेक्स्ट निकालेगा।'
            : 'You can now take a photo or upload an image of SMS on your phone! AI will automatically extract the text.'}
        </AlertDescription>
      </Alert>
    </div>
  );
}