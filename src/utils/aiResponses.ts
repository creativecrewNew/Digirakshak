import { Language } from '../types';
import { analyzeSMS } from './fraudDetectionAdvanced';
import { getFraudTips } from './fraudDetection';

// ============================================
// INTELLIGENT AI CHATBOT RESPONSE GENERATOR
// ============================================
// This chatbot can respond to ANY query, not just predefined ones

// Comprehensive keyword database for intelligent matching
const keywordDatabase = {
  // Greetings and general conversation
  greetings: ['hello', 'hi', 'hey', 'namaste', 'namaskar', 'नमस्ते', 'नमस्कार', 'வணக்கம்', 'నమస్కారం', 'ಹಲೋ', 'ഹലോ', 'হ্যালো', 'હેલો', 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ'],
  thanks: ['thank', 'thanks', 'धन्यवाद', 'நன்றி', 'ధన్యవాదాలు', 'ಧನ್ಯವಾದ', 'നന്ദി', 'धन्यवाद', 'આભાર'],
  help: ['help', 'assist', 'support', 'मदद', 'सहायता', 'உதவி', 'సహాయం', 'ಸಹಾಯ', 'സഹായം', 'সাহায্য'],
  
  // Fraud detection keywords
  identify: ['identify', 'spot', 'recognize', 'detect', 'find', 'पहचान', 'जान', 'अडையாळம்', 'గుర్తించ', 'ಗುರುತಿಸು', 'തിരിച്ചറിയുക'],
  scam: ['scam', 'fraud', 'fake', 'cheat', 'घोटाला', 'धोखा', 'धोखाधड़ी', 'மோசடி', 'మోసం', 'ವಂಚನೆ', 'തട്ടിപ്പ്'],
  suspicious: ['suspicious', 'doubt', 'suspect', 'संदिग्ध', 'शंका', 'சந்தேகம்', 'అనుమాनం', 'ಅನುಮಾन', 'സംശയം'],
  
  // Financial keywords
  bank: ['bank', 'banking', 'बैंक', 'बैंकिंग', 'வங்கி', 'బ్యాంక్', 'ಬ್ಯಾಂक್', 'ബാങ്ക്', 'ব্যাংক', 'બેંક'],
  otp: ['otp', 'pin', 'password', 'cvv', 'ओटीपी', 'पिन', 'पासवर्ड', 'ஓடिपி', 'கடவுச்சொல்', 'ఓటీపీ', 'పాస్వर్డ్'],
  money: ['money', 'cash', 'rupee', 'paisa', 'payment', 'पैसा', 'रुपया', 'பணம்', 'डब్బు', 'ಹಣ', 'പണം', 'টাকা'],
  
  // Scam types
  lottery: ['lottery', 'prize', 'winner', 'won', 'reward', 'लॉटरी', 'इनाम', 'जीता', 'பரிசு', 'లాటరీ', 'లಾಟರಿ', 'ലോട്ടറി'],
  kyc: ['kyc', 'update', 'verify', 'केवाईसी', 'अपडेट', 'सत्यापन', 'புதுப்பிப்பு', 'అప్డేట్', 'ಕೆವೈಸಿ'],
  link: ['link', 'url', 'click', 'tap', 'लिंक', 'क्लिक', 'இணைப்பு', 'లింక్', 'ಲಿಂಕ್', 'ലിങ്ക്'],
  
  // Actions and advice
  what: ['what', 'why', 'how', 'when', 'where', 'who', 'क्या', 'कैसे', 'क्यों', 'என்ன', 'எப்படி', 'ఏమి', 'ఎలా', 'ಏनು', 'എന്ത്'],
  report: ['report', 'complain', 'file', 'रिपोर्ट', 'शिकायत', 'புகார்', 'నివేదన', 'ದೂರು', 'പരാതി'],
  safe: ['safe', 'protect', 'secure', 'safety', 'सुरक्षित', 'बचाव', 'பாதுகாப்பு', 'సురక్షిतం', 'ಸುರಕ್ಷೆ', 'സുരക്ഷ'],
};

// Multilingual response templates
const responseTemplates = {
  en: {
    greeting: [
      "Hello! I'm your AI fraud detection assistant. I'm here to help protect you from digital scams. How can I assist you today?",
      "Hi there! I'm DigiRakshak's AI assistant. I can help you identify fraud, understand scams, and stay safe online. What would you like to know?",
      "Welcome! I'm here to answer all your questions about fraud prevention and digital safety. Ask me anything!",
    ],
    thanks: [
      "You're very welcome! Stay safe and vigilant. If you have any more questions, I'm always here to help!",
      "Happy to help! Remember to always verify before trusting any message. Feel free to ask me anything anytime!",
      "My pleasure! Your safety is our priority. Don't hesitate to reach out if you need anything else!",
    ],
    dontUnderstand: [
      "I understand you're asking about '{query}'. While I may not have a specific answer, I can tell you about fraud prevention. Could you rephrase your question or ask about SMS fraud, banking scams, or digital safety?",
      "That's an interesting question about '{query}'. Let me help you with fraud detection instead. You can ask me about identifying scams, OTP fraud, KYC scams, or how to report fraud.",
      "I'm here to help with fraud detection and digital safety. Regarding '{query}', could you make it more specific to scams or online safety? For example, ask about bank SMS, suspicious messages, or fraud prevention tips.",
    ],
    general: [
      "Great question! DigiRakshak is designed to protect you from SMS fraud. I can help you:\n\n🛡️ Identify fraudulent messages\n🛡️ Understand different types of scams\n🛡️ Learn what to do when you receive suspicious SMS\n🛡️ Report fraud to authorities\n🛡️ Stay safe online\n\nWhat specific aspect would you like to know more about?",
    ],
  },
  hi: {
    greeting: [
      "नमस्ते! मैं आपका AI धोखाधड़ी पहचान सहायक हूं। मैं यहां आपको डिजिटल घोटालों से बचाने में मदद के लिए हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
      "नमस्कार! मैं DigiRakshak का AI सहायक हूं। मैं आपको धोखाधड़ी की पहचान करने, घोटालों को समझने और ऑनलाइन सुरक्षित रहने में मदद कर सकता हूं। आप क्या जानना चाहेंगे?",
      "स्वागत है! मैं धोखाधड़ी रोकथाम और डिजिटल सुरक्षा के बारे में आपके सभी सवालों के जवाब देने के लिए यहां हूं। मुझसे कुछ भी पूछें!",
    ],
    thanks: [
      "आपका स्वागत है! सुरक्षित और सतर्क रहें। यदि आपके और प्रश्न हैं, तो मैं हमेशा मदद के लिए यहां हूं!",
      "मदद करके खुशी हुई! किसी भी संदेश पर भरोसा करने से पहले हमेशा सत्यापित करें। मुझसे कभी भी कुछ भी पूछने में संकोच न करें!",
      "मेरी खुशी! आपकी सुरक्षा हमारी प्राथमिकता है। यदि आपको कुछ और चाहिए तो संपर्क करने में संकोच न करें!",
    ],
    dontUnderstand: [
      "मैं समझता हूं कि आप '{query}' के बारे में पूछ रहे हैं। हालांकि मेरे पास विशिष्ट उत्तर नहीं हो सकता है, मैं आपको धोखाधड़ी रोकथाम के बारे में बता सकता हूं। क्या आप अपने प्रश्न को दोबारा बता सकते हैं या SMS धोखाधड़ी, बैंकिंग घोटालों या डिजिटल सुरक्षा के बारे में पूछ सकते हैं?",
      "यह '{query}' के बारे में एक दिलचस्प सवाल है। आइए मैं आपको धोखाधड़ी पहचान में मदद करूं। आप मुझसे घोटालों की पहचान, OTP धोखाधड़ी, KYC घोटाले या धोखाधड़ी की रिपोर्ट कैसे करें के बारे में पूछ सकते हैं।",
      "मैं धोखाधड़ी पहचान और डिजिटल सुरक्षा में मदद के लिए यहां हूं। '{query}' के संबंध में, क्या आप इसे घोटालों या ऑनलाइन सुरक्षा के लिए अधिक विशिष्ट बना सकते हैं? उदाहरण के लिए, बैंक SMS, संदिग्ध संदेश या धोखाधड़ी रोकथाम युक्तियों के बारे में पूछें।",
    ],
    general: [
      "बढ़िया सवाल! DigiRakshak को आपको SMS धोखाधड़ी से बचाने के लिए डिज़ाइन किया गया है। मैं आपकी मदद कर सकता हूं:\n\n🛡️ धोखाधड़ी संदेशों की पहचान करना\n🛡️ विभिन्न प्रकार के घोटालों को समझना\n🛡️ संदिग्ध SMS प्राप्त होने पर क्या करना है यह जानना\n🛡️ अधिकारियों को धोखाधड़ी की रिपोर्ट करना\n🛡️ ऑनलाइन सुरक्षित रहना\n\nआप किस विशिष्ट पहलू के बारे में अधिक जानना चाहेंगे?",
    ],
  },
};

// Add fallback for other languages
['pa', 'ta', 'te', 'kn', 'ml', 'bn', 'gu', 'bho', 'hne'].forEach(lang => {
  responseTemplates[lang as Language] = responseTemplates.en;
});

// Topic-specific response generator
function generateTopicResponse(topic: string, language: Language): string {
  const responses: Record<string, Record<Language, string>> = {
    fraudIdentification: {
      en: "To identify fraud SMS, watch for these red flags:\n\n🚩 Requests for OTP, PIN, CVV, or passwords\n🚩 Shortened URLs (bit.ly, tinyurl, etc.)\n🚩 Urgent language ('act now', 'expires today', 'last chance')\n🚩 Prize/lottery winning notifications you didn't enter\n🚩 Banking info requests via SMS\n🚩 Suspicious sender IDs (random numbers/letters)\n🚩 Poor grammar and spelling errors\n🚩 Threats of account blocking\n🚩 Too-good-to-be-true offers\n\n💡 Remember: Banks NEVER ask for sensitive info via SMS. Always verify through official channels!",
      hi: "धोखाधड़ी SMS की पहचान करने के लिए इन संकेतों पर ध्यान दें:\n\n🚩 OTP, PIN, CVV या पासवर्ड मांगना\n🚩 छोटे URL (bit.ly, tinyurl, आदि)\n🚩 जरूरी भाषा ('अभी करें', 'आज समाप्त', 'अंतिम मौका')\n🚩 इनाम/लॉटरी जीतने की सूचना जो आपने दर्ज नहीं की\n🚩 SMS के माध्यम से बैंकिंग जानकारी मांगना\n🚩 संदिग्ध प्रेषक ID (यादृच्छिक संख्या/अक्षर)\n🚩 खराब व्याकरण और वर्तनी की गलतियां\n🚩 खाता ब्लॉक करने की धमकियां\n🚩 बहुत अच्छे लगने वाले प्रस्ताव\n\n💡 याद रखें: बैंक कभी भी SMS के माध्यम से संवेदनशील जानकारी नहीं मांगते। हमेशा आधिकारिक चैनलों के माध्यम से सत्यापित करें!",
    },
    otpFraud: {
      en: "OTP Fraud - The Most Common Scam:\n\n❌ How it works:\n• Scammer calls pretending to be from bank/company\n• Claims urgent issue with your account\n• Asks you to 'verify' by sharing OTP\n• Uses YOUR OTP to access account/steal money\n\n✅ Protection Tips:\n🔐 NEVER share OTP with anyone - not even bank staff\n🔐 OTP is only for YOU to enter on trusted websites\n🔐 Banks/Companies never ask for OTP over call/SMS\n🔐 Each OTP is like your digital signature\n🔐 If you shared OTP by mistake, immediately:\n   • Block your card/account (call bank)\n   • Change all passwords\n   • Report to 1930 (Cybercrime)\n\n💡 Remember: Your OTP = Your Money!",
      hi: "OTP धोखाधड़ी - सबसे आम घोटाला:\n\n❌ यह कैसे काम करता है:\n• धोखेबाज बैंक/कंपनी होने का दिखावा करके कॉल करता है\n• आपके खाते में जरूरी समस्या का दावा करता है\n• OTP साझा करके 'सत्यापित' करने को कहता है\n• आपके OTP का उपयोग खाते तक पहुंचने/पैसे चुराने के लिए करता है\n\n✅ सुरक्षा युक्तियाँ:\n🔐 OTP कभी भी किसी के साथ साझा न करें - बैंक कर्मचारी के साथ भी नहीं\n🔐 OTP केवल आपके लिए विश्वसनीय वेबसाइटों पर दर्ज करने के लिए है\n🔐 बैंक/कंपनियां कभी भी कॉल/SMS पर OTP नहीं मांगते\n🔐 प्रत्येक OTP आपके डिजिटल हस्ताक्षर की तरह है\n🔐 यदि आपने गलती से OTP साझा कर दिया, तो तुरंत:\n   • अपना कार्ड/खाता ब्लॉक करें (बैंक को कॉल करें)\n   • सभी पासवर्ड बदलें\n   • 1930 (साइबर क्राइम) पर रिपोर्ट करें\n\n💡 याद रखें: आपका OTP = आपका पैसा!",
    },
    bankingSMS: {
      en: "How to Identify Legitimate Bank SMS:\n\n✅ SAFE Bank Messages:\n• From official sender IDs (SBIINB, HDFCBK, ICICIB, etc.)\n• Only informational (transaction alerts, balance)\n• Proper grammar and spelling\n• Links go to official bank domains (.in, verified)\n• Never ask for OTP/PIN/CVV/passwords\n• Match alerts in your official bank app\n\n❌ FAKE Bank Messages:\n• From random numbers or suspicious IDs\n• Ask for sensitive information\n• Have shortened URLs (bit.ly, etc.)\n• Create urgency ('account will be blocked')\n• Poor grammar and spelling\n• Offer prizes/rewards\n\n💡 Always verify through:\n• Official bank app\n• Number printed on your debit/credit card\n• Bank's official website\n\nNever trust SMS links blindly!",
      hi: "वैध बैंक SMS की पहचान कैसे करें:\n\n✅ सुरक्षित बैंक संदेश:\n• आधिकारिक प्रेषक ID से (SBIINB, HDFCBK, ICICIB, आदि)\n• केवल सूचनात्मक (लेनदेन अलर्ट, शेष)\n• उचित व्याकरण और वर्तनी\n• लिंक आधिकारिक बैंक डोमेन पर जाते हैं (.in, सत्यापित)\n• कभी भी OTP/PIN/CVV/पासवर्ड नहीं मांगते\n• आपके आधिकारिक बैंक ऐप में अलर्ट से मेल खाते हैं\n\n❌ नकली बैंक संदेश:\n• यादृच्छिक संख्या या संदिग्ध ID से\n• संवेदनशील जानकारी मांगते हैं\n• छोटे URL हैं (bit.ly, आदि)\n• जरूरी बनाते हैं ('खाता ब्लॉक हो जाएगा')\n• खराब व्याकरण और वर्तनी\n• इनाम/पुरस्कार प्रदान करते हैं\n\n💡 हमेशा इसके माध्यम से सत्यापित करें:\n• आधिकारिक बैंक ऐप\n• आपके डेबिट/क्रेडिट कार्ड पर छपा नंबर\n• बैंक की आधिकारिक वेबसाइट\n\nकभी भी SMS लिंक पर आंख बंद करके भरोसा न करें!",
    },
    lotteryScam: {
      en: "Lottery/Prize Scams - 100% FAKE:\n\n⚠️ Common Tactics:\n• 'Congratulations! You won ₹25 lakh in KBC lottery'\n• 'Selected as lucky winner in Flipkart contest'\n• 'Your number won iPhone 14 in lucky draw'\n• 'Claim your prize by paying ₹5000 tax'\n\n❌ TRUTH:\n• You CANNOT win a lottery you didn't enter\n• Real prizes NEVER require upfront payment\n• KBC doesn't run SMS lotteries\n• Companies don't randomly select 'winners'\n• These are designed to steal your money/info\n\n✅ What to do:\n• Delete immediately\n• Never call the number or click links\n• Never pay any 'fees' or 'taxes'\n• Report to 1930\n• Warn your family/friends\n\n💡 If it sounds too good to be true, it IS!",
      hi: "लॉटरी/इनाम घोटाले - 100% नकली:\n\n⚠️ आम रणनीति:\n• 'बधाई हो! आपने KBC लॉटरी में ₹25 लाख जीते'\n• 'Flipkart प्रतियोगिता में भाग्यशाली विजेता के रूप में चयनित'\n• 'आपके नंबर ने लकी ड्रा में iPhone 14 जीता'\n• '₹5000 टैक्स देकर अपना इनाम दावा करें'\n\n❌ सच्चाई:\n• आप ऐसी लॉटरी नहीं जीत सकते जो आपने दर्ज नहीं की\n• असली इनामों के लिए अग्रिम भुगतान की आवश्यकता नहीं होती\n• KBC SMS लॉटरी नहीं चलाता\n• कंपनियां यादृच्छिक रूप से 'विजेता' नहीं चुनतीं\n• ये आपके पैसे/जानकारी चुराने के लिए डिज़ाइन किए गए हैं\n\n✅ क्या करें:\n• तुरंत हटा दें\n• कभी भी नंबर पर कॉल न करें या लिंक पर क्लिक न करें\n• कभी भी कोई 'शुल्क' या 'कर' न दें\n• 1930 पर रिपोर्ट करें\n• अपने परिवार/दोस्तों को चेतावनी दें\n\n💡 अगर यह बहुत अच्छा लगता है, तो यह है!",
    },
    kycScam: {
      en: "KYC Update Scams:\n\n⚠️ Common Fake Messages:\n• 'Your KYC is pending - account will be blocked'\n• 'Update KYC immediately or lose access'\n• 'Complete e-KYC now - click here'\n• 'Aadhaar-PAN linking pending'\n\n❌ REALITY:\n• Real KYC updates happen IN PERSON at bank\n• Banks don't send SMS links for KYC\n• No account gets blocked for 'pending KYC'\n• Government uses official channels, not SMS\n• Aadhaar/PAN linking is done on official portals\n\n✅ How Real KYC Works:\n• Visit your bank branch\n• Or use official bank's mobile app\n• Or govt portals (uidai.gov.in, incometax.gov.in)\n• Requires physical document verification\n• Bank will inform you well in advance\n\n💡 Don't panic! Scammers create fake urgency. Your account is safe.",
      hi: "KYC अपडेट घोटाले:\n\n⚠️ आम नकली संदेश:\n• 'आपका KYC लंबित है - खाता ब्लॉक हो जाएगा'\n• 'तुरंत KYC अपडेट करें या एक्सेस खो दें'\n• 'अभी e-KYC पूरा करें - यहां क्लिक करें'\n• 'आधार-पैन लिंकिंग लंबित'\n\n❌ वास्तविकता:\n• असली KYC अपडेट बैंक में व्यक्तिगत रूप से होते हैं\n• बैंक KYC के लिए SMS लिंक नहीं भेजते\n• 'लंबित KYC' के लिए कोई खाता ब्लॉक नहीं होता\n• सरकार आधिकारिक चैनलों का उपयोग करती है, SMS नहीं\n• आधार/पैन लिंकिंग आधिकारिक पोर्टल पर की जाती है\n\n✅ असली KYC कैसे काम करता है:\n• अपनी बैंक शाखा में जाएं\n• या आधिकारिक बैंक के मोबाइल ऐप का उपयोग करें\n• या सरकारी पोर्टल (uidai.gov.in, incometax.gov.in)\n• भौतिक दस्तावेज़ सत्यापन की आवश्यकता है\n• बैंक आपको पहले से सूचित करेगा\n\n💡 घबराएं नहीं! धोखेबाज नकली जरूरी बनाते हैं। आपका खाता सुरक्षित है।",
    },
    reporting: {
      en: "How to Report Fraud:\n\n📞 Immediate Actions:\n1. National Cybercrime Helpline: 1930\n2. Online Portal: cybercrime.gov.in\n3. Email: report@cybercrime.gov.in\n\n📱 What to Report:\n• Screenshot of the fraudulent message\n• Sender's number/ID\n• Date and time received\n• Details of any money lost\n• Any links or numbers from the message\n\n🏦 If Money Lost:\n• Immediately call your bank's helpline\n• Block your cards/account\n• File FIR at nearest police station\n• Contact bank fraud department\n\n📋 Documents Needed:\n• Copy of fraudulent SMS\n• Bank statements (if money transferred)\n• Your ID proof\n• Complaint acknowledgment\n\n⚡ Act Fast - Report within 24 hours for best results!\n\n💡 DigiRakshak also lets you report directly in the Community section!",
      hi: "धोखाधड़ी की रिपोर्ट कैसे करें:\n\n📞 तत्काल कार्रवाई:\n1. राष्ट्रीय साइबर क्राइम हेल्पलाइन: 1930\n2. ऑनलाइन पोर्टल: cybercrime.gov.in\n3. ईमेल: report@cybercrime.gov.in\n\n📱 क्या रिपोर्ट करें:\n• धोखाधड़ी संदेश का स्क्रीनशॉट\n• प्रेषक का नंबर/ID\n• प्राप्त होने की तिथि और समय\n• खोए हुए पैसे का विवरण\n• संदेश से कोई लिंक या नंबर\n\n🏦 यदि पैसे खो गए:\n• तुरंत अपने बैंक की हेल्पलाइन पर कॉल करें\n• अपने कार्ड/खाते को ब्लॉक करें\n• निकटतम पुलिस स्टेशन में FIR दर्ज करें\n• बैंक धोखाधड़ी विभाग से संपर्क करें\n\n📋 आवश्यक दस्तावेज़:\n• धोखाधड़ी SMS की प्रति\n• बैंक स्टेटमेंट (यदि पैसे ट्रांसफर हुए)\n• आपका ID प्रमाण\n• शिकायत पावती\n\n⚡ तेज़ी से कार्य करें - सर्वोत्तम परिणामों के लिए 24 घंटे के भीतर रिपोर्ट करें!\n\n💡 DigiRakshak आपको सीधे समुदाय अनुभाग में रिपोर्ट करने देता है!",
    },
    generalSafety: {
      en: "Digital Safety Tips:\n\n🔒 Golden Rules:\n1. NEVER share OTP/PIN/CVV with anyone\n2. Banks never ask for credentials via SMS/call\n3. Verify sender before clicking any links\n4. If in doubt, contact official helpline directly\n5. Don't trust caller ID - can be spoofed\n6. Real emergencies don't come via random SMS\n\n🛡️ Safe Practices:\n• Use official bank apps only\n• Enable two-factor authentication\n• Regularly check bank statements\n• Don't save CVV/PIN in phone\n• Update passwords regularly\n• Install antivirus on phone\n• Only download apps from Play Store\n\n⚠️ Red Flags:\n• Urgent/threatening language\n• Requests for money transfer\n• Too-good-to-be-true offers\n• Spelling/grammar errors\n• Suspicious links or attachments\n\n💡 Trust your instincts - if something feels wrong, it probably is!",
      hi: "डिजिटल सुरक्षा युक्तियाँ:\n\n🔒 स्वर्णिम नियम:\n1. OTP/PIN/CVV किसी के साथ कभी साझा न करें\n2. बैंक कभी भी SMS/कॉल के माध्यम से क्रेडेंशियल नहीं मांगते\n3. किसी भी लिंक पर क्लिक करने से पहले प्रेषक को सत्यापित करें\n4. संदेह होने पर सीधे आधिकारिक हेल्पलाइन से संपर्क करें\n5. कॉलर ID पर भरोसा न करें - स्पूफ किया जा सकता है\n6. असली आपातकाल यादृच्छिक SMS से नहीं आते\n\n🛡️ सुरक्षित प्रथाएं:\n• केवल आधिकारिक बैंक ऐप का उपयोग करें\n• दो-कारक प्रमाणीकरण सक्षम करें\n• नियमित रूप से बैंक स्टेटमेंट जांचें\n• फोन में CVV/PIN न सहेजें\n• नियमित रूप से पासवर्ड अपडेट करें\n• फोन पर एंटीवायरस इंस्टॉल करें\n• केवल Play Store से ऐप डाउनलोड करें\n\n⚠️ खतरे के संकेत:\n• जरूरी/धमकी भरी भाषा\n• पैसे ट्रांसफर के लिए अनुरोध\n• बहुत अच्छे लगने वाले प्रस्ताव\n• वर्तनी/व्याकरण त्रुटियां\n• संदिग्ध लिंक या अटैचमेंट\n\n💡 अपनी सहज बुद्धि पर भरोसा करें - अगर कुछ गलत लगता है, तो शायद वह है!",
    },
  };

  return responses[topic]?.[language] || responses[topic]?.['en'] || '';
}

// Intelligent query analyzer
function analyzeQuery(userInput: string): { topic: string; confidence: number; keywords: string[] } {
  const lowerInput = userInput.toLowerCase();
  const foundKeywords: string[] = [];
  const scores: Record<string, number> = {};

  // Check for greeting
  if (keywordDatabase.greetings.some(word => lowerInput.includes(word))) {
    return { topic: 'greeting', confidence: 100, keywords: ['greeting'] };
  }

  // Check for thanks
  if (keywordDatabase.thanks.some(word => lowerInput.includes(word))) {
    return { topic: 'thanks', confidence: 100, keywords: ['thanks'] };
  }

  // Analyze for fraud-related topics
  Object.entries(keywordDatabase).forEach(([category, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerInput.includes(keyword)) {
        foundKeywords.push(keyword);
        scores[category] = (scores[category] || 0) + 1;
      }
    });
  });

  // Determine primary topic
  if (scores.otp >= 1) return { topic: 'otpFraud', confidence: 80, keywords: foundKeywords };
  if (scores.kyc >= 1) return { topic: 'kycScam', confidence: 80, keywords: foundKeywords };
  if (scores.lottery >= 1) return { topic: 'lotteryScam', confidence: 85, keywords: foundKeywords };
  if (scores.bank >= 1) return { topic: 'bankingSMS', confidence: 75, keywords: foundKeywords };
  if (scores.identify >= 1 || scores.scam >= 1) return { topic: 'fraudIdentification', confidence: 70, keywords: foundKeywords };
  if (scores.report >= 1) return { topic: 'reporting', confidence: 80, keywords: foundKeywords };
  if (scores.safe >= 1) return { topic: 'generalSafety', confidence: 70, keywords: foundKeywords };

  return { topic: 'unknown', confidence: 30, keywords: foundKeywords };
}

// Check if input looks like an SMS message to analyze
function isSMSMessage(input: string): boolean {
  // Check if it's a longer message with typical SMS patterns
  const smsPatterns = [
    /dear\s+customer/i,
    /your\s+(account|card|kyc|upi)/i,
    /click\s+(here|link)/i,
    /otp|pin|cvv|password/i,
    /congratulations/i,
    /won|prize|lottery/i,
    /₹\s*\d+|rs\.?\s*\d+/i,
    /verify|update|expire/i,
    /urgent|immediate/i,
  ];

  return input.length > 50 && smsPatterns.some(pattern => pattern.test(input));
}

// Main AI Response Generator
export function generateAIResponse(userInput: string, language: Language): string {
  const context: ResponseContext = { userInput, language };
  
  // Check if user is pasting an SMS for analysis
  if (isSMSMessage(userInput)) {
    // Analyze the SMS
    const analysis = analyzeSMS('UNKNOWN', userInput);
    
    const analysisResponse = language === 'hi' 
      ? `मैंने आपके संदेश का विश्लेषण किया। यहां परिणाम हैं:\n\n🎯 धोखाधड़ी स्कोर: ${analysis.fraudScore}%\n⚠️ यह ${analysis.isScam ? '**घोटाला है**' : 'सुरक्षित लगता है'}\n\n❌ पाए गए मुद्दे:\n${analysis.reasons.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n💡 सलाह: ${analysis.isScam ? 'इस संदेश को तुरंत हटा दें और किसी भी लिंक पर क्लिक न करें। 1930 पर रिपोर्ट करें।' : 'हालांकि यह सुरक्षित लगता है, लेकिन हमेशा सतर्क रहें।'}`
      : `I've analyzed your message. Here are the results:\n\n🎯 Fraud Score: ${analysis.fraudScore}%\n⚠️ This is ${analysis.isScam ? '**A SCAM**' : 'appears safe'}\n\n❌ Issues Found:\n${analysis.reasons.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n💡 Advice: ${analysis.isScam ? 'Delete this message immediately and do NOT click any links. Report to 1930.' : 'While this appears safe, always stay vigilant.'}`;
    
    return analysisResponse;
  }

  // Analyze the query
  const analysis = analyzeQuery(userInput);

  // Generate response based on topic
  if (analysis.topic === 'greeting') {
    const templates = responseTemplates[language]?.greeting || responseTemplates.en.greeting;
    return templates[Math.floor(Math.random() * templates.length)];
  }

  if (analysis.topic === 'thanks') {
    const templates = responseTemplates[language]?.thanks || responseTemplates.en.thanks;
    return templates[Math.floor(Math.random() * templates.length)];
  }

  if (analysis.topic === 'unknown') {
    // Provide helpful fallback
    const templates = responseTemplates[language]?.dontUnderstand || responseTemplates.en.dontUnderstand;
    const template = templates[Math.floor(Math.random() * templates.length)];
    const query = userInput.substring(0, 50) + (userInput.length > 50 ? '...' : '');
    return template.replace('{query}', query);
  }

  // Generate topic-specific response
  const topicResponse = generateTopicResponse(analysis.topic, language);
  if (topicResponse) {
    return topicResponse;
  }

  // Fallback to general response
  const generalTemplates = responseTemplates[language]?.general || responseTemplates.en.general;
  return generalTemplates[0];
}

// Quick responses for common questions
export function getQuickResponses(language: Language): string[] {
  const quick: Record<Language, string[]> = {
    en: [
      "How do I identify a fraud SMS?",
      "What should I do if I shared my OTP?",
      "Are lottery winning messages real?",
      "How to report fraud to authorities?",
    ],
    hi: [
      "धोखाधड़ी SMS की पहचान कैसे करें?",
      "यदि मैंने अपना OTP साझा कर दिया तो क्या करूं?",
      "क्या लॉटरी जीतने के संदेश असली हैं?",
      "अधिकारियों को धोखाधड़ी की रिपोर्ट कैसे करें?",
    ],
  };

  return quick[language] || quick.en;
}