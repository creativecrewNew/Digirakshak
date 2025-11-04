import React from 'react';
import { Phone, Shield, Users, Baby, AlertTriangle, ExternalLink, X, Check, Info } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Language } from '../types';
import { t } from '../utils/translations';

interface EmergencyContactsProps {
  language: Language;
}

// Complete translations for Emergency Contacts
const translations: Record<string, Record<Language, string>> = {
  headerDescription: {
    en: 'Contact immediately for help in danger',
    hi: 'खतरे में मदद के लिए तुरंत संपर्क करें',
    pa: 'ਖਤਰੇ ਵਿੱਚ ਮਦਦ ਲਈ ਤੁਰੰਤ ਸੰਪਰਕ ਕਰੋ',
    ta: 'ஆபத்தில் உதவிக்கு உடனடியாக தொடர்பு கொள்ளுங்கள்',
    te: 'ప్రమాదంలో సహాయం కోసం వెంటనే సంప్రదించండి',
    kn: 'ಅಪಾಯದಲ್ಲಿ ಸಹಾಯಕ್ಕಾಗಿ ತಕ್ಷಣ ಸಂಪರ್ಕಿಸಿ',
    ml: 'അപകടത്തിൽ സഹായത്തിനായി ഉടൻ ബന്ധപ്പെടുക',
    bn: 'বিপদে সাহায্যের জন্য অবিলম্বে যোগাযোগ করুন',
    gu: 'જોખમમાં મદદ માટે તરત જ સંપર્ક કરો',
    bho: 'खतरा में मदद खातिर तुरंत संपर्क करीं',
    hne: 'खतरे में मदद खातर तुरंत संपर्क करो',
  },
  cyberCrimeDesc: {
    en: 'National Cyber Crime Reporting Portal - 24/7 Available',
    hi: 'राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल - 24/7 उपलब्ध',
    pa: 'ਰਾਸ਼ਟਰੀ ਸਾਈਬਰ ਅਪਰਾਧ ਰਿਪੋਰਟਿੰਗ ਪੋਰਟਲ - 24/7 ਉਪਲਬਧ',
    ta: 'தேசிய இணைய குற்ற அறிக்கை போர்டல் - 24/7 கிடைக்கும்',
    te: 'జాతీయ సైబర్ క్రైమ్ రిపోర్టింగ్ పోర్టల్ - 24/7 అందుబాటులో',
    kn: 'ರಾಷ್ಟ್ರೀಯ ಸೈಬರ್ ಅಪರಾಧ ವರದಿ ಪೋರ್ಟಲ್ - 24/7 ಲಭ್ಯವಿದೆ',
    ml: 'ദേശീയ സൈബർ ക്രൈം റിപ്പോർട്ടിംഗ് പോർട്ടൽ - 24/7 ലഭ്യം',
    bn: 'জাতীয় সাইবার অপরাধ রিপোর্টিং পোর্টাল - 24/7 উপলব্ধ',
    gu: 'રાષ્ટ્રીય સાયબર ક્રાઈમ રિપોર્ટિંગ પોર્ટલ - 24/7 ઉપલબ્ધ',
    bho: 'राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल - 24/7 उपलब्ध',
    hne: 'राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल - 24/7 उपलब्ध',
  },
  policeDesc: {
    en: 'Police Emergency Helpline',
    hi: 'पुलिस आपातकालीन हेल्पलाइन',
    pa: 'ਪੁਲਿਸ ਐਮਰਜੈਂਸੀ ਹੈਲਪਲਾਈਨ',
    ta: 'காவல்துறை அவசர உதவி எண்',
    te: 'పోలీస్ అత్యవసర హెల్ప్‌లైన్',
    kn: 'ಪೊಲೀಸ್ ತುರ್ತು ಸಹಾಯವಾಣಿ',
    ml: 'പോലീസ് എമർജൻസി ഹെൽപ്പ്‌ലൈൻ',
    bn: 'পুলিশ জরুরি হেল্পলাইন',
    gu: 'પોલીસ કટોકટી હેલ્પલાઇન',
    bho: 'पुलिस आपातकालीन हेल्पलाइन',
    hne: 'पुलिस आपातकालीन हेल्पलाइन',
  },
  womenDesc: {
    en: 'Women Helpline - 24/7 Support for Women',
    hi: 'महिला हेल्पलाइन - महिलाओं के लिए 24/7 सहायता',
    pa: 'ਔਰਤਾਂ ਹੈਲਪਲਾਈਨ - ਔਰਤਾਂ ਲਈ 24/7 ਸਹਾਇਤਾ',
    ta: 'பெண்கள் உதவி எண் - பெண்களுக்கான 24/7 ஆதரவு',
    te: 'మహిళా హెల్ప్‌లైన్ - మహిళలకు 24/7 మద్దతు',
    kn: 'ಮಹಿಳಾ ಸಹಾಯವಾಣಿ - ಮಹಿಳೆಯರಿಗೆ 24/7 ಬೆಂಬಲ',
    ml: 'വനിതാ ഹെൽപ്പ്‌ലൈൻ - സ്ത്രീകൾക്കുള്ള 24/7 പിന്തുണ',
    bn: 'মহিলা হেল্পলাইন - মহিলাদের জন্য 24/7 সহায়তা',
    gu: 'મહિલા હેલ્પલાઇન - મહિલાઓ માટે 24/7 સહાય',
    bho: 'महिला हेल्पलाइन - महिला खातिर 24/7 सहायता',
    hne: 'महिला हेल्पलाइन - महिलावां खातर 24/7 सहायता',
  },
  childDesc: {
    en: 'Childline India - Emergency Service for Children',
    hi: 'चाइल्डलाइन इंडिया - बच्चों के लिए आपातकालीन सेवा',
    pa: 'ਚਾਈਲਡਲਾਈਨ ਇੰਡੀਆ - ਬੱਚਿਆਂ ਲਈ ਐਮਰਜੈਂਸੀ ਸੇਵਾ',
    ta: 'சைல்ட்லைன் இந்தியா - குழந்தைகளுக்கான அவசர சேவை',
    te: 'చైల్డ్‌లైన్ ఇండియా - పిల్లలకు అత్యవసర సేవ',
    kn: 'ಚೈಲ್ડ್‌ಲೈನ್ ಇಂಡಿಯಾ - ಮక್ಕಳಿಗಾಗಿ ತುರ್ತು ಸೇವೆ',
    ml: 'ചൈൽഡ്‌ലൈൻ ഇന്ത്യ - കുട്ടികൾക്കുള്ള എമർജൻസി സേവനം',
    bn: 'চাইল্ডলাইন ইন্ডিয়া - শিশুদের জন্য জরুরি পরিষেবা',
    gu: 'ચાઈલ્ડલાઈન ઈન્ડિયા - બાળકો માટે કટોકટી સેવા',
    bho: 'चाइल्डलाइन इंडिया - बच्चा खातिर आपातकालीन सेवा',
    hne: 'चाइल्डलाइन इंडिया - बच्चयां खातर आपातकालीन सेवा',
  },
  reportFraudOnline: {
    en: 'Report Fraud Online',
    hi: 'ऑनलाइन धोखाधड़ी रिपोर्ट करें',
    pa: 'ਔਨਲਾਈਨ ਧੋਖਾਧੜੀ ਰਿਪੋਰਟ ਕਰੋ',
    ta: 'ஆன்லைன் மோசடியை புகாரளிக்கவும்',
    te: 'ఆన్‌లైన్ మోసాన్ని నివేదించండి',
    kn: 'ఆన್‌లೈನ್ ವಂಚನೆಯನ್ನು ವರದಿ ಮಾಡಿ',
    ml: 'ഓൺലൈൻ തട്ടിപ്പ് റിപ്പോർട്ട് ചെയ്യുക',
    bn: 'অনলাইনে জালিয়াতি রিপোর্ট করুন',
    gu: 'ઑનલાઇન છેતરપિંડી જાણ કરો',
    bho: 'ऑनलाइन धोखाधड़ी रिपोर्ट करीं',
    hne: 'ऑनलाइन धोखाधड़ी रिपोर्ट करो',
  },
  fileComplaintDesc: {
    en: 'File your complaint on National Cyber Crime Reporting Portal',
    hi: 'राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल पर अपनी शिकायत दर्ज करें',
    pa: 'ਰਾਸ਼ਟਰੀ ਸਾਈਬਰ ਅਪਰਾਧ ਰਿਪੋਰਟਿੰਗ ਪੋਰਟਲ ਤੇ ਆਪਣੀ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ',
    ta: 'தேசிய இணைய குற்ற அறிக்கை போர்டலில் உங்கள் புகாரை பதிவு செய்யுங்கள்',
    te: 'జాతీయ సైబర్ క్రైమ్ రిపోర్టింగ్ పోర్టల్‌లో మీ ఫిర్యాదును దాఖలు చేయండి',
    kn: 'ರಾಷ್ಟ್ರೀಯ ಸೈಬರ್ ಅಪರಾಧ ವರದಿ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನಿಮ್ಮ ದೂರು ದಾಖಲಿಸಿ',
    ml: 'ദേശീയ സൈബർ ക്രൈം റിപ്പോർട്ടിംഗ് പോർട്ടലിൽ നിങ്ങളുടെ പരാതി രജിസ്റ്റർ ചെയ്യുക',
    bn: 'জাতীয় সাইবার অপরাধ রিপোর্টিং পোর্টালে আপনার অভিযোগ দায়ের করুন',
    gu: 'রાષ્ટ્રીય સાયબર ક્રાઈમ રિપોર્ટિંગ પોર્ટલ પર તમારી ફરિયાદ નોંધાવો',
    bho: 'राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल पर आपन शिकायत दर्ज करीं',
    hne: 'राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल पै आपणी शिकायत दर्ज करो',
  },
  fileComplaint: {
    en: 'File Complaint',
    hi: 'शिकायत दर्ज करें',
    pa: 'ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ',
    ta: 'புகார் பதிவு செய்யவும்',
    te: 'ఫిర్యాదు దాఖలు చేయండి',
    kn: 'ದೂರು ದಾಖಲಿಸಿ',
    ml: 'പരാതി രജിസ്റ്റർ ചെയ്യുക',
    bn: 'অভিযোগ দায়ের করুন',
    gu: 'ફરિયાદ દાખલ કરો',
    bho: 'शिकायत दर्ज करीं',
    hne: 'शिकायत दर्ज करो',
  },
  trackComplaint: {
    en: 'Track Complaint',
    hi: 'शिकायत ट्रैक करें',
    pa: 'ਸ਼ਿਕਾਇਤ ਟਰੈਕ ਕਰੋ',
    ta: 'புகாரைத் தொடரவும்',
    te: 'ఫిర్యాదును ట్రాక్ చేయండి',
    kn: 'ದೂರನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    ml: 'പരാതി ട്രാക്ക് ചെയ്യുക',
    bn: 'অভিযোগ ট্র্যাক করুন',
    gu: 'ફરિયાદ ટ્રેક કરો',
    bho: 'शिकायत ट्रैक करीं',
    hne: 'शिकायत ट्रैक करो',
  },
  importantSafetyTips: {
    en: 'Important Safety Tips',
    hi: 'महत्वपूर्ण सुरक्षा सुझाव',
    pa: 'ਮਹੱਤਵਪੂਰਨ ਸੁਰੱਖਿਆ ਸੁਝਾਅ',
    ta: 'முக்கிய பாதுகாப்பு குறிப்புகள்',
    te: 'ముఖ్యమైన భద్రతా చిట్కాలు',
    kn: 'ಪ್ರಮುಖ ಸುರಕ್ಷತಾ ಸಲಹೆಗಳು',
    ml: 'പ്രധാന സുരക്ഷാ നുറുങ്ങുകൾ',
    bn: 'গুরুত্বপূর্ণ নিরাপত্তা টিপস',
    gu: 'મહત્વપૂર્ણ સલામતી ટિપ્સ',
    bho: 'महत्वपूर्ण सुरक्षा सुझाव',
    hne: 'महत्वपूर्ण सुरक्षा सुझाव',
  },
  neverShare: {
    en: 'Never Share',
    hi: 'कभी भी साझा न करें',
    pa: 'ਕਦੇ ਵੀ ਸਾਂਝਾ ਨਾ ਕਰੋ',
    ta: 'ஒருபோதும் பகிர வேண்டாம்',
    te: 'ఎప్పుడూ పంచుకోవద్దు',
    kn: 'ಎಂದಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ',
    ml: 'ഒരിക്കലും പങ്കിടരുത്',
    bn: 'কখনও শেয়ার করবেন না',
    gu: 'ક્યારેય શેર કરશો નહીં',
    bho: 'कबो साझा ना करीं',
    hne: 'कदे साझा नई करना',
  },
  bewareOf: {
    en: 'Beware of',
    hi: 'सावधान रहें',
    pa: 'ਸਾਵਧਾਨ ਰਹੋ',
    ta: 'எச்சரிக்கையாக இருங்கள்',
    te: 'జాగ్రత్తగా ఉండండి',
    kn: 'ಎಚ್ಚರದಿಂದಿરಿ',
    ml: 'ശ്രദ്ധിക്കുക',
    bn: 'সতর্ক থাকুন',
    gu: 'સાવચેત રહો',
    bho: 'सावधान रहीं',
    hne: 'सावधान रहो',
  },
  alwaysVerify: {
    en: 'Always Verify',
    hi: 'हमेशा सत्यापित करें',
    pa: 'ਹਮੇਸ਼ਾ ਪੁਸ਼ਟੀ ਕਰੋ',
    ta: 'எப்போதும் சரிபார்க்கவும்',
    te: 'ఎల్లప్పుడూ ధృవీకరించండి',
    kn: 'ಯಾವಾಗಲೂ ಪરಿಶೀലಿಸಿ',
    ml: 'എപ്പോഴും പരിശോധിക്കുക',
    bn: 'সর্বদা যাচাই করুন',
    gu: 'હંમેશા ચકાસો',
    bho: 'हमेशा सत्यापित करीं',
    hne: 'हमेशा सत्यापित करो',
  },
  whatToDoFraud: {
    en: 'What to Do If Fraud Occurs',
    hi: 'धोखाधड़ी होने पर क्या करें',
    pa: 'ਧੋਖਾਧੜੀ ਹੋਣ ਤੇ ਕੀ ਕਰੀਏ',
    ta: 'மோசடி நடந்தால் என்ன செய்வது',
    te: 'మోసం జరిగితే ఏమి చేయాలి',
    kn: 'ವಂಚನೆ ಸಂಭವಿಸಿದರೆ ಏನು ಮಾಡಬೇಕು',
    ml: 'തട്ടിപ്പ് സംഭവിച്ചാൽ എന്ത് ചെയ്യണം',
    bn: 'জালিয়াতি হলে কী করবেন',
    gu: 'છેતરપિંડી થાય તો શું કરવું',
    bho: 'धोखाधड़ी होखे तs का करीं',
    hne: 'धोखाधड़ी होवै तो का करो',
  },
  quickDial: {
    en: 'Quick Dial',
    hi: 'तुरंत डायल करें',
    pa: 'ਤੁਰੰਤ ਡਾਇਲ ਕਰੋ',
    ta: 'விரைவு டயல்',
    te: 'శీఘ్ర డయల్',
    kn: 'ತ್వರಿತ ಡಯಲ್',
    ml: 'ദ്രുത ഡയൽ',
    bn: 'দ্রুত ডায়াল',
    gu: 'ઝડપી ડાયલ',
    bho: 'तुरंत डायल करीं',
    hne: 'तुरंत डायल करो',
  },
};

const tr = (key: string, lang: Language): string => translations[key]?.[lang] || translations[key]?.['en'] || key;

export function EmergencyContacts({ language }: EmergencyContactsProps) {
  const contacts = [
    {
      icon: Shield,
      name: t('cyberCrimeHelpline', language),
      number: '1930',
      description: tr('cyberCrimeDesc', language),
      color: 'border-primary bg-primary/5',
      website: 'https://cybercrime.gov.in',
    },
    {
      icon: Phone,
      name: t('policeEmergency', language),
      number: '100',
      description: tr('policeDesc', language),
      color: 'border-blue-500 bg-blue-500/5',
      website: null,
    },
    {
      icon: Users,
      name: t('womenHelpline', language),
      number: '181',
      description: tr('womenDesc', language),
      color: 'border-pink-500 bg-pink-500/5',
      website: null,
    },
    {
      icon: Baby,
      name: t('childHelpline', language),
      number: '1098',
      description: tr('childDesc', language),
      color: 'border-orange-500 bg-orange-500/5',
      website: null,
    },
  ];

  // Safety tips data for all languages
  const getSafetyTips = (lang: Language) => {
    const tipsData: Record<Language, any> = {
      en: [
        {
          title: 'Never Share',
          icon: X,
          items: ['OTP, PIN, CVV', 'Bank Passwords', 'Aadhaar/PAN Details', 'Credit Card Information'],
        },
        {
          title: 'Beware of',
          icon: AlertTriangle,
          items: ['Unknown Links', 'Urgent Money Requests', 'Prize/Lottery Messages', 'Fake Government Calls'],
        },
        {
          title: 'Always Verify',
          icon: Check,
          items: ['With Official Bank Number', 'Through Government Website', 'With Family Members', 'At Local Police Station'],
        },
      ],
      hi: [
        {
          title: 'कभी भी साझा न करें',
          icon: X,
          items: ['OTP, PIN, CVV', 'बैंक पासवर्ड', 'आधार/PAN विवरण', 'क्रेडिट कार्ड जानकारी'],
        },
        {
          title: 'सावधान रहें',
          icon: AlertTriangle,
          items: ['अज्ञात लिंक से', 'तुरंत पैसे की मांग से', 'इनाम/लॉटरी संदेशों से', 'फर्जी सरकारी कॉल से'],
        },
        {
          title: 'हमेशा सत्यापित करें',
          icon: Check,
          items: ['बैंक के आधिकारिक नंबर से', 'सरकारी वेबसाइट से', 'परिवार के सदस्यों से', 'स्थानीय पुलिस स्टेशन से'],
        },
      ],
      // All other languages will use translated titles with similar structure
    };
    
    return tipsData[lang] || [
      {
        title: tr('neverShare', lang),
        icon: X,
        items: ['OTP, PIN, CVV', 'Bank Passwords', 'Aadhaar/PAN', 'Credit Card Info'],
      },
      {
        title: tr('bewareOf', lang),
        icon: AlertTriangle,
        items: ['Unknown Links', 'Money Requests', 'Prize Messages', 'Fake Calls'],
      },
      {
        title: tr('alwaysVerify', lang),
        icon: Check,
        items: ['Official Bank Number', 'Govt Website', 'Family Members', 'Police Station'],
      },
    ];
  };

  // Fraud steps for all languages
  const getFraudSteps = (lang: Language) => {
    const steps: Record<Language, string[]> = {
      en: [
        'Immediately inform your bank and block account',
        'Call 1930 or local cyber cell',
        'File online complaint at cybercrime.gov.in',
        'Save transaction details and screenshots',
        'Change your debit/credit card passwords',
        'Spread awareness on social media',
      ],
      hi: [
        'तुरंत अपने बैंक को सूचित करें और खाता ब्लॉक करवाएं',
        '1930 या स्थानीय साइबर सेल को कॉल करें',
        'cybercrime.gov.in पर ऑनलाइन शिकायत दर्ज करें',
        'लेनदेन विवरण और स्क्रीनशॉट सहेजें',
        'अपने डेबिट/क्रेडिट कार्ड पासवर्ड बदलें',
        'सोशल मीडिया पर जागरूकता फैलाएं',
      ],
      pa: [
        'ਤੁਰੰਤ ਆਪਣੇ ਬੈਂਕ ਨੂੰ ਸੂਚਿਤ ਕਰੋ ਅਤੇ ਖਾਤਾ ਬਲੌਕ ਕਰੋ',
        '1930 ਜਾਂ ਸਥਾਨਕ ਸਾਈਬਰ ਸੈੱਲ ਨੂੰ ਕਾਲ ਕਰੋ',
        'cybercrime.gov.in ਤੇ ਔਨਲਾਈਨ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ',
        'ਲੈਣ-ਦੇਣ ਵਿਵਰਣ ਅਤੇ ਸਕ੍ਰੀਨਸ਼ੌਟ ਸੁਰੱਖਿਅਤ ਕਰੋ',
        'ਆਪਣੇ ਡੈਬਿਟ/ਕ੍ਰੈਡਿਟ ਕਾਰਡ ਪਾਸਵਰਡ ਬਦਲੋ',
        'ਸੋਸ਼ਲ ਮੀਡੀਆ ਤੇ ਜਾਗਰੂਕਤਾ ਫੈਲਾਓ',
      ],
      ta: [
        'உடனடியாக உங்கள் வங்கிக்கு தெரிவித்து கணக்கை தடுக்கவும்',
        '1930 அல்லது உள்ளூர் சைபர் செல்லை அழைக்கவும்',
        'cybercrime.gov.in இல் ஆன்லைன் புகார் பதிவு செய்யவும்',
        'பரிவர்த்தனை விவரங்கள் மற்றும் ஸ்கிரீன்ஷாட்களை சேமிக்கவும்',
        'உங்கள் டெபிட்/க்ரெடிட் கார்ட் கடவுச்சொற்களை மாற்றவும்',
        'சமூக ஊடகங்களில் விழிப்புணர்வை பரப்பவும்',
      ],
      te: [
        'వెంటనే మీ బ్యాంకుకు తెలియజేసి ఖాతాను బ్లాక్ చేయండి',
        '1930 లేదా స్థానిక సైబర్ సెల్‌కు కాల్ చేయండి',
        'cybercrime.gov.in లో ఆన్‌లైన్ ఫిర్యాదు దాఖలు చేయండి',
        'లావాదేవీ వివరాలు మరియు స్క్రీన్‌షాట్‌లను సేవ్ చేయండి',
        'మీ డెబిట్/క్రెడిట్ కార్డ్ పాస్‌వర్డ్‌లను మార్చండి',
        'సోషల్ మీడియాలో అవగాహన వ్యాప్తి చేయండి',
      ],
      kn: [
        'ತಕ್ಷಣ ನಿಮ್ಮ ಬ್ಯಾಂಕ್‌ಗೆ ತಿಳಿಸಿ ಮತ್ತು ಖಾತೆಯನ್ನು ನಿರ್ಬಂಧಿಸಿ',
        '1930 ಅಥವಾ ಸ್ಥಳೀಯ ಸೈಬರ್ ಸೆಲ್‌ಗೆ ಕರೆ ಮಾಡಿ',
        'cybercrime.gov.in ನಲ್ಲಿ ಆನ್‌ಲೈನ್ ದೂರು ದಾಖಲಿಸಿ',
        'ವಹಿವಾಟು ವಿವರಗಳು ಮತ್ತು ಸ್ಕ್ರೀನ್‌ಶಾಟ್‌ಗಳನ್ನು ಉಳಿಸಿ',
        'ನಿಮ್ಮ ಡೆಬಿಟ್/ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಪಾಸ್‌ವರ್ಡ್‌ಗಳನ್ನು ಬದಲಾಯಿಸಿ',
        'ಸಾಮಾಜಿಕ ಮಾಧ್ಯಮದಲ್ಲಿ ಜಾಗೃತಿ ಹರಡಿ',
      ],
      ml: [
        'ഉടനടി നിങ്ങളുടെ ബാങ്കിനെ അറിയിക്കുകയും അക്കൗണ്ട് ബ്ലോക്ക് ചെയ്യുകയും ചെയ്യുക',
        '1930 അല്ലെങ്കിൽ പ്രാദേശിക സൈബർ സെല്ലിൽ വിളിക്കുക',
        'cybercrime.gov.in ൽ ഓൺലൈൻ പരാതി ഫയൽ ചെയ്യുക',
        'ഇടപാട് വിശദാംശങ്ങളും സ്ക്രീൻഷോട്ടുകളും സംരക്ഷിക്കുക',
        'നിങ്ങളുടെ ഡെബിറ്റ്/ക്രെഡിറ്റ് കാർഡ് പാസ്‌വേഡുകൾ മാറ്റുക',
        'സോഷ്യൽ മീഡിയയിൽ അവബോധം പ്രചരിപ്പിക്കുക',
      ],
      bn: [
        'অবিলম্বে আপনার ব্যাঙ্ককে জানান এবং অ্যাকাউন্ট ব্লক করুন',
        '1930 বা স্থানীয় সাইবার সেল কল করুন',
        'cybercrime.gov.in এ অনলাইন অভিযোগ দায়ের করুন',
        'লেনদেনের বিবরণ এবং স্ক্রিনশট সংরক্ষণ করুন',
        'আপনার ডেবিট/ক্রেডিট কার্ড পাসওয়ার্ড পরিবর্তন করুন',
        'সোশ্যাল মিডিয়ায় সচেতনতা ছড়িয়ে দিন',
      ],
      gu: [
        'તાત્કાલિક તમારી બેંકને જાણ કરો અને ખાતું બ્લોક કરો',
        '1930 અથવા સ્થાનિક સાયબર સેલને કૉલ કરો',
        'cybercrime.gov.in પર ઑનલાઇન ફરિયાદ નોંધાવો',
        'વ્યવહાર વિગતો અને સ્ક્રીનશોટ સાચવો',
        'તમારા ડેબિટ/ક્રેડિટ કાર્ડ પાસવર્ડ બદલો',
        'સોશિયલ મીડિયા પર જાગૃતિ ફેલાવો',
      ],
      bho: [
        'तुरंत आपन बैंक के सूचित करीं आ खाता बंद करवाईं',
        '1930 या स्थानीय साइबर सेल के कॉल करीं',
        'cybercrime.gov.in पर ऑनलाइन शिकायत दर्ज करीं',
        'लेनदेन विवरण आ स्क्रीनशॉट सहेजीं',
        'आपन डेबिट/क्रेडिट कार्ड पासवर्ड बदलीं',
        'सोशल मीडिया पर जागरूकता फैलाईं',
      ],
      hne: [
        'तुरंत आपणे बैंक नै सूचित करो अर खाता बंद करवाओ',
        '1930 या स्थानीय साइबर सेल नै कॉल करो',
        'cybercrime.gov.in पै ऑनलाइन शिकायत दर्ज करो',
        'लेनदेन विवरण अर स्क्रीनशॉट सहेजो',
        'आपणे डेबिट/क्रेडिट कार्ड पासवर्ड बदलो',
        'सोशल मीडिया पै जागरूकता फैलाओ',
      ],
    };
    
    return steps[lang] || steps['en'];
  };

  const safetyTips = getSafetyTips(language);
  const fraudSteps = getFraudSteps(language);

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex p-4 bg-red-500/10 rounded-2xl mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="mb-2">{t('emergencyContacts', language)}</h1>
        <p className="text-muted-foreground">
          {tr('headerDescription', language)}
        </p>
      </div>

      {/* Emergency Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contacts.map((contact, idx) => {
          const Icon = contact.icon;
          return (
            <Card key={idx} className={`p-6 border-2 ${contact.color} hover:shadow-lg transition-all`}>
              <div className="inline-flex p-3 bg-primary/10 rounded-lg mb-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              
              <h3 className="mb-2">{contact.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{contact.description}</p>
              
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => window.open(`tel:${contact.number}`)}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {contact.number}
                </Button>
                
                {contact.website && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(contact.website!, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Report Fraud Online */}
      <Card className="p-6 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 bg-red-500 rounded-lg">
            <ExternalLink className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-red-900 dark:text-red-100 mb-1">
              {tr('reportFraudOnline', language)}
            </h2>
            <p className="text-red-700 dark:text-red-300 text-sm">
              {tr('fileComplaintDesc', language)}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={() => window.open('https://cybercrime.gov.in', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            {tr('fileComplaint', language)}
          </Button>
          
          <Button
            variant="outline"
            className="border-red-300 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300"
            onClick={() => window.open('https://www.cybercrime.gov.in/Webform/trackComplaint.aspx', '_blank')}
          >
            {tr('trackComplaint', language)}
          </Button>
        </div>
      </Card>

      {/* Safety Tips */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-primary" />
          <h2>{tr('importantSafetyTips', language)}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {safetyTips.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <div key={idx}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                  <h3>{tip.title}</h3>
                </div>
                <ul className="space-y-2">
                  {tip.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Card>

      {/* What to Do */}
      <Card className="p-6 bg-accent/50">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-primary" />
          <h2>{tr('whatToDoFraud', language)}</h2>
        </div>
        
        <div className="space-y-3">
          {fraudSteps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-card rounded-lg border">
              <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm shrink-0">
                {idx + 1}
              </div>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Dial Section */}
      <Card className="p-6 bg-red-500 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-5 h-5" />
          <h2>{tr('quickDial', language)}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['1930', '100', '181', '1098'].map((number) => (
            <Button
              key={number}
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-lg py-6"
              onClick={() => window.open(`tel:${number}`)}
            >
              <Phone className="w-4 h-4 mr-2" />
              {number}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}