import { FraudPattern, SMSMessage } from '../types';

// WORKING fraud detection patterns - tested and verified
const fraudPatterns: FraudPattern[] = [
  // URLs and links - CRITICAL (using simpler regex)
  { pattern: /http/gi, weight: 45, reason: 'Contains suspicious link' },
  { pattern: /bit\.ly/gi, weight: 50, reason: 'Shortened URL detected' },
  { pattern: /tinyurl/gi, weight: 50, reason: 'Shortened URL detected' },
  { pattern: /click here/gi, weight: 35, reason: 'Suspicious link instruction' },
  { pattern: /tap here/gi, weight: 35, reason: 'Suspicious link instruction' },
  
  // Banking/Financial keywords (English) - HIGH RISK
  { pattern: /account/gi, weight: 40, reason: 'Banking information requested' },
  { pattern: /bank/gi, weight: 40, reason: 'Banking information requested' },
  { pattern: /credit card/gi, weight: 40, reason: 'Banking information requested' },
  { pattern: /debit card/gi, weight: 40, reason: 'Banking information requested' },
  { pattern: /\bpin\b/gi, weight: 40, reason: 'Banking information requested' },
  { pattern: /\bcvv\b/gi, weight: 40, reason: 'Banking information requested' },
  { pattern: /\botp\b/gi, weight: 40, reason: 'Banking information requested' },
  { pattern: /password/gi, weight: 40, reason: 'Banking information requested' },
  
  // Urgency tactics
  { pattern: /blocked/gi, weight: 45, reason: 'Urgency tactics detected' },
  { pattern: /suspended/gi, weight: 45, reason: 'Urgency tactics detected' },
  { pattern: /expired/gi, weight: 45, reason: 'Urgency tactics detected' },
  { pattern: /locked/gi, weight: 45, reason: 'Urgency tactics detected' },
  
  // Verification requests
  { pattern: /verify/gi, weight: 35, reason: 'Verification request' },
  { pattern: /update/gi, weight: 35, reason: 'Verification request' },
  { pattern: /confirm/gi, weight: 35, reason: 'Verification request' },
  
  // Prize/Lottery scams - CRITICAL
  { pattern: /prize/gi, weight: 50, reason: 'Prize/reward scam pattern' },
  { pattern: /winner/gi, weight: 50, reason: 'Prize/reward scam pattern' },
  { pattern: /lottery/gi, weight: 50, reason: 'Prize/reward scam pattern' },
  { pattern: /reward/gi, weight: 50, reason: 'Prize/reward scam pattern' },
  { pattern: /gift/gi, weight: 50, reason: 'Prize/reward scam pattern' },
  { pattern: /congratulations/gi, weight: 50, reason: 'Prize/reward scam pattern' },
  { pattern: /\bwon\b/gi, weight: 50, reason: 'Prize/reward scam pattern' },
  
  // Money transfer - CRITICAL
  { pattern: /send money/gi, weight: 50, reason: 'Money transfer request' },
  { pattern: /transfer/gi, weight: 50, reason: 'Money transfer request' },
  { pattern: /payment/gi, weight: 50, reason: 'Money transfer request' },
  { pattern: /pay now/gi, weight: 50, reason: 'Money transfer request' },
  { pattern: /paytm/gi, weight: 50, reason: 'Money transfer request' },
  { pattern: /phonepe/gi, weight: 50, reason: 'Money transfer request' },
  { pattern: /gpay/gi, weight: 50, reason: 'Money transfer request' },
  { pattern: /\bupi\b/gi, weight: 50, reason: 'Money transfer request' },
  
  // KYC scams
  { pattern: /\bkyc\b/gi, weight: 45, reason: 'KYC scam pattern' },
  
  // Urgency words
  { pattern: /immediately/gi, weight: 25, reason: 'Creates false urgency' },
  { pattern: /urgent/gi, weight: 25, reason: 'Creates false urgency' },
  { pattern: /\bnow\b/gi, weight: 25, reason: 'Creates false urgency' },
];

// Known scam sender patterns
const suspiciousSenders = [
  { pattern: /^[A-Z]{2}-[A-Z0-9]+$/i, weight: 25, reason: 'Suspicious sender format' },
  { pattern: /^[0-9]{5,6}$/, weight: 20, reason: 'Unverified short code' },
  { pattern: /^\+91[0-9]{10}$/, weight: 30, reason: 'Personal mobile number' },
  { pattern: /REWARD/i, weight: 40, reason: 'Suspicious prize sender' },
  { pattern: /PRIZE/i, weight: 40, reason: 'Suspicious prize sender' },
  { pattern: /WINNER/i, weight: 40, reason: 'Suspicious prize sender' },
];

// Known legitimate senders (whitelist)
const legitimateSenders = [
  /^SBIINB$/i,
  /^HDFCBK$/i,
  /^ICICIB$/i,
  /^AXISBK$/i,
  /^KOTAKB$/i,
  /^PNBSMS$/i,
  /^AMZIND$/i,
  /^FKSHOP$/i,
  /^PAYTMB$/i,
  /^AIRTEL$/i,
  /^VODAIN$/i,
  /^JIOINF$/i,
  /^SWIGGY$/i,
  /^ZOMATO$/i,
  /^VK-SBIINB$/i,
  /^VK-HDFCBK$/i,
  /^VK-ICICIB$/i,
  /^TX-AXISBK$/i,
  /^VM-AIRTEL$/i,
];

export function analyzeSMS(sender: string, content: string): SMSMessage {
  let fraudScore = 0;
  const reasons: string[] = [];
  
  console.log('========================================');
  console.log('FRAUD DETECTION START');
  console.log('Sender:', sender);
  console.log('Content:', content);
  console.log('========================================');
  
  // Check if sender is legitimate
  const isLegitimate = legitimateSenders.some(pattern => pattern.test(sender));
  console.log('Is Legitimate Sender:', isLegitimate);
  
  // Check content against fraud patterns
  let patternMatches = 0;
  fraudPatterns.forEach(({ pattern, weight, reason }) => {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      fraudScore += weight;
      if (!reasons.includes(reason)) {
        reasons.push(reason);
      }
      patternMatches++;
      console.log(`✓ MATCH: ${pattern} | Weight: +${weight} | Reason: ${reason}`);
    }
  });
  
  console.log(`Total pattern matches: ${patternMatches}`);
  console.log(`Score after content check: ${fraudScore}`);
  
  // Check sender patterns (only if not whitelisted)
  if (!isLegitimate) {
    suspiciousSenders.forEach(({ pattern, weight, reason }) => {
      if (pattern.test(sender)) {
        fraudScore += weight;
        if (!reasons.includes(reason)) {
          reasons.push(reason);
        }
        console.log(`✓ SENDER MATCH: ${pattern} | Weight: +${weight} | Reason: ${reason}`);
      }
    });
  }
  
  console.log(`Score after sender check: ${fraudScore}`);
  
  // Reduce score for legitimate senders with transactional keywords
  if (isLegitimate) {
    const transactionalWords = ['credited', 'debited', 'balance', 'transaction'];
    const isTransactional = transactionalWords.some(word => 
      content.toLowerCase().includes(word)
    );
    
    if (isTransactional) {
      console.log('Transactional message from legitimate sender - reducing score');
      fraudScore = Math.max(0, fraudScore - 50);
    }
  }
  
  // Cap score at 100
  fraudScore = Math.max(0, Math.min(fraudScore, 100));
  
  const isScam = fraudScore >= 50;
  
  console.log('========================================');
  console.log('FINAL FRAUD SCORE:', fraudScore, '%');
  console.log('IS SCAM:', isScam);
  console.log('REASONS:', reasons);
  console.log('========================================');
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    sender,
    content,
    timestamp: new Date(),
    fraudScore,
    isScam,
    reasons,
  };
}

export function getAlertMessage(language: string, fraudScore: number): string {
  const alerts: Record<string, Record<string, string>> = {
    en: {
      critical: "CRITICAL DANGER! This is almost certainly a scam. Do NOT click links, share OTP, PIN, or send money. Delete immediately and report to 1930.",
      high: "HIGH RISK! This message shows multiple fraud indicators. Do not click any links or share personal information.",
      medium: "SUSPICIOUS! This message shows warning signs. Be extremely cautious. Verify with official sources.",
      low: "Be careful! Some suspicious elements detected. Always verify sender authenticity.",
      safe: "This message appears safe, but always exercise caution.",
    },
    hi: {
      critical: "गंभीर खतरा! यह धोखाधड़ी है। किसी भी लिंक पर क्लिक न करें, OTP, PIN साझा न करें या पैसे न भेजें।",
      high: "उच्च जोखिम! यह संदेश धोखाधड़ी के संकेत दिखाता है। सावधान रहें।",
      medium: "संदिग्ध! सावधानी बरतें। आधिकारिक स्रोतों से सत्यापित करें।",
      low: "सावधान रहें! कुछ संदिग्ध तत्व पाए गए।",
      safe: "यह संदेश सुरक्षित लगता है, लेकिन सावधानी बरतें।",
    },
  };
  
  const level = fraudScore >= 80 ? 'critical' : fraudScore >= 60 ? 'high' : fraudScore >= 40 ? 'medium' : fraudScore >= 20 ? 'low' : 'safe';
  return alerts[language]?.[level] || alerts['en'][level];
}

export function getFraudTips(language: string): string[] {
  const tips: Record<string, string[]> = {
    en: [
      "Never share OTP, PIN, CVV with anyone - EVER",
      "Banks NEVER ask for sensitive info via SMS",
      "Always verify sender before clicking links",
      "Do not respond to urgent money requests",
      "Report suspicious messages to 1930",
      "Check official bank app for real alerts",
      "NO free prizes/lotteries - they are all scams",
      "Government does not ask for info via SMS",
      "Check sender ID matches official bank format",
      "Real emergencies do not come via random SMS"
    ],
    hi: [
      "कभी भी OTP, पिन, CVV किसी के साथ साझा न करें",
      "बैंक SMS से संवेदनशील जानकारी नहीं मांगते",
      "लिंक पर क्लिक करने से पहले सत्यापित करें",
      "तुरंत पैसे के अनुरोधों का जवाब न दें",
      "संदिग्ध संदेशों को 1930 पर रिपोर्ट करें",
      "असली अलर्ट के लिए बैंक ऐप जांचें",
      "कोई मुफ्त इनाम/लॉटरी नहीं - सभी घोटाले हैं",
      "सरकार SMS से जानकारी नहीं मांगती",
      "प्रेषक ID जांचें",
      "असली आपातकाल SMS से नहीं आते"
    ],
    pa: [
      "OTP, ਪਿੰਨ, CVV ਕਿਸੇ ਨਾਲ ਸਾਂਝਾ ਨਾ ਕਰੋ",
      "ਬੈਂਕ SMS ਰਾਹੀਂ ਜਾਣਕਾਰੀ ਨਹੀਂ ਮੰਗਦੇ",
      "ਲਿੰਕ ਤੇ ਕਲਿੱਕ ਤੋਂ ਪਹਿਲਾਂ ਪੁਸ਼ਟੀ ਕਰੋ",
      "ਤੁਰੰਤ ਪੈਸੇ ਦੀਆਂ ਬੇਨਤੀਆਂ ਦਾ ਜਵਾਬ ਨਾ ਦਿਓ",
      "ਸ਼ੱਕੀ ਸੁਨੇਹਿਆਂ ਦੀ 1930 ਤੇ ਰਿਪੋਰਟ ਕਰੋ",
      "ਅਸਲੀ ਅਲਰਟ ਲਈ ਬੈਂਕ ਐਪ ਜਾਂਚੋ",
      "ਕੋਈ ਮੁਫਤ ਇਨਾਮ ਨਹੀਂ - ਸਾਰੇ ਘੋਟਾਲੇ ਹਨ",
      "ਸਰਕਾਰ SMS ਰਾਹੀਂ ਜਾਣਕਾਰੀ ਨਹੀਂ ਮੰਗਦੀ",
      "ਭੇਜਣ ਵਾਲੇ ਦੀ ID ਜਾਂਚੋ",
      "ਅਸਲੀ ਐਮਰਜੈਂਸੀ SMS ਰਾਹੀਂ ਨਹੀਂ ਆਉਂਦੀ"
    ],
    ta: [
      "OTP, பின், CVV யாருடனும் பகிர வேண்டாம்",
      "வங்கிகள் SMS மூலம் தகவல் கேட்பதில்லை",
      "இணைப்புகளை கிளிக் செய்வதற்கு முன் சரிபார்க்கவும்",
      "அவசர பண கோரிக்கைகளுக்கு பதிலளிக்க வேண்டாம்",
      "சந்தேக செய்திகளை 1930 இல் புகாரளிக்கவும்",
      "உண்மையான விழிப்பூட்டல்களுக்கு வங்கி ஆப்பை சரிபார்க்கவும்",
      "இலவச பரிசுகள் இல்லை - எல்லாம் மோசடி",
      "அரசாங்கம் SMS மூலம் தகவல் கேட்பதில்லை",
      "அனுப்புநர் ID ஐ சரிபார்க்கவும்",
      "உண்மையான அவசரநிலைகள் SMS வழி வராது"
    ],
    te: [
      "OTP, పిన్, CVV ఎవరితోనూ పంచుకోవద్దు",
      "బ్యాంకులు SMS ద్వారా సమాచారం అడగవు",
      "లింక్‌లను క్లిక్ చేయడానికి ముందు ధృవీకరించండి",
      "అత్యవసర డబ్బు అభ్యర్థనలకు స్పందించవద్దు",
      "అనుమాన సందేశాలను 1930కి నివేదించండి",
      "నిజమైన హెచ్చరికల కోసం బ్యాంక్ యాప్ తనిఖీ చేయండి",
      "ఉచిత బహుమతులు లేవు - అన్నీ మోసాలు",
      "ప్రభుత్వం SMS ద్వారా సమాచారం అడగదు",
      "పంపినవారి ID తనిఖీ చేయండి",
      "నిజమైన అత్యవసరతలు SMS ద్వారా రావు"
    ],
    kn: [
      "OTP, ಪಿನ್, CVV ಯಾರೊಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ",
      "ಬ್ಯಾಂಕುಗಳು SMS ಮೂಲಕ ಮಾಹಿತಿ ಕೇಳುವುದಿಲ್ಲ",
      "ಲಿಂಕ್‌ಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡುವ ಮೊದಲು ಪರಿಶೀಲಿಸಿ",
      "ತುರ್ತು ಹಣದ ವಿನಂತಿಗಳಿಗೆ ಪ್ರತಿಕ್ರಿಯಿಸಬೇಡಿ",
      "ಅನುಮಾನಾಸ್ಪದ ಸಂದೇಶಗಳನ್ನು 1930 ಗೆ ವರದಿ ಮಾಡಿ",
      "ನಿಜವಾದ ಎಚ್ಚರಿಕೆಗಳಿಗಾಗಿ ಬ್ಯಾಂಕ್ ಅಪ್ಲಿಕೇಶನ್ ಪರಿಶೀಲಿಸಿ",
      "ಉಚಿತ ಬಹುಮಾನಗಳಿಲ್ಲ - ಎಲ್ಲಾ ವಂಚನೆಗಳು",
      "ಸರ್ಕಾರವು SMS ಮೂಲಕ ಮಾಹಿತಿ ಕೇಳುವುದಿಲ್ಲ",
      "ಕಳುಹಿಸುವವರ ID ಪರಿಶೀಲಿಸಿ",
      "ನಿಜವಾದ ತುರ್ತುಸ್ಥಿತಿಗಳು SMS ಮೂಲಕ ಬರುವುದಿಲ್ಲ"
    ],
    ml: [
      "OTP, പിൻ, CVV ആരോടും പങ്കിടരുത്",
      "ബാങ്കുകൾ SMS വഴി വിവരങ്ങൾ ചോദിക്കില്ല",
      "ലിങ്കുകൾ ക്ലിക്ക് ചെയ്യുന്നതിന് മുമ്പ് പരിശോധിക്കുക",
      "അടിയന്തര പണ അഭ്യർത്ഥനകൾക്ക് പ്രതികരിക്കരുത്",
      "സംശയാസ്പദ സന്ദേശങ്ങൾ 1930 ൽ റിപ്പോർട്ട് ചെയ്യുക",
      "യഥാർത്ഥ അലേർട്ടുകൾക്കായി ബാങ്ക് ആപ്പ് പരിശോധിക്കുക",
      "സൗജന്യ സമ്മാനങ്ങളില്ല - എല്ലാം തട്ടിപ്പുകൾ",
      "സർക്കാർ SMS വഴി വിവരങ്ങൾ ചോദിക്കുന്നില്ല",
      "അയച്ചയാളുടെ ID പരിശോധിക്കുക",
      "യഥാർത്ഥ അടിയന്തരാവസ്ഥകൾ SMS വഴി വരുന്നില്ല"
    ],
    bn: [
      "OTP, প���ন, CVV কারও সাথে শেয়ার করবেন না",
      "ব্যাংক SMS এর মাধ্যমে তথ্য চায় না",
      "লিঙ্ক ক্লিক করার আগে যাচাই করুন",
      "জরুরী অর্থের অনুরোধে সাড়া দেবেন না",
      "সন্দেহজনক বার্তা 1930 এ রিপোর্ট করুন",
      "প্রকৃত সতর্কতার জন্য ব্যাংক অ্যাপ চেক করুন",
      "বিনামূল্যে পুরস্কার নেই - সবই প্রতারণা",
      "সরকার SMS এর মাধ্যমে তথ্য চায় না",
      "প্রেরক ID পরীক্ষা করুন",
      "প্রকৃত জরুরী অবস্থা SMS এর মাধ্যমে আসে না"
    ],
    gu: [
      "OTP, પિન, CVV કોઈની સાથે શેર કરશો નહીં",
      "બેંક SMS દ્વારા માહિતી માંગતી નથી",
      "લિંક ક્લિક કરતા પહેલા ચકાસો",
      "તાત્કાલિક પૈસાની વિનંતીઓનો જવાબ ન આપો",
      "શંકાસ્પદ સંદેશાઓ 1930 પર જાણ કરો",
      "વાસ્તવિક ચેતવણીઓ માટે બેંક એપ તપાસો",
      "કોઈ મફત ઈનામો નથી - બધા કૌભાંડો છે",
      "સરકાર SMS દ્વારા માહિતી માંગતી નથી",
      "પ્રેષક ID તપાસો",
      "વાસ્તવિક કટોકટીઓ SMS દ્વારા આવતી નથી"
    ],
    bho: [
      "OTP, पिन, CVV केहू से शेयर ना करीं",
      "बैंक SMS से जानकारी ना मांगे",
      "लिंक पर क्लिक करे से पहिले जांच करीं",
      "तुरंत पइसा मांगे के जवाब ना दीं",
      "संदेह वाला संदेश 1930 पर रिपोर्ट करीं",
      "असली अलर्ट खातिर बैंक ऐप देखीं",
      "कौनो फ्री इनाम नइखे - सब घोटाला बा",
      "सरकार SMS से जानकारी ना मांगे",
      "भेजे वाला ID जांच करीं",
      "असली इमरजेंसी SMS से ना आवे"
    ],
    hne: [
      "OTP, पिन, CVV किसे कै साथ शेयर नई करना",
      "बैंक SMS तै जानकारी नई मांगदे",
      "लिंक पै क्लिक करन तै पैहले जांच करो",
      "तुरंत पैसे मांगण के जवाब नई द्यो",
      "शक वाळे संदेश 1930 पै रिपोर्ट करो",
      "असली अलर्ट खातर बैंक ऐप देखो",
      "कोए फ्री इनाम नई - सारे घोटाळे सै",
      "सरकार SMS तै जानकारी नई मांगदी",
      "भेजण आळे की ID देखो",
      "असली इमरजेंसी SMS तै नई आंदी"
    ],
  };
  
  return tips[language] || tips['en'];
}
