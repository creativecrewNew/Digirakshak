import { SMSMessage } from '../types';

// ============================================
// COMPREHENSIVE FRAUD DETECTION DATABASE
// ============================================
// Enhanced for Android with 200+ patterns covering 22+ scam categories
// Optimized for Indian fraud landscape

// CRITICAL FRAUD PATTERNS (High weight: 80-100)
const criticalPatterns = [
  // Phishing URLs and suspicious links
  { pattern: /bit\.ly|tinyurl|goo\.gl|short\.link|ow\.ly|cutt\.ly|t\.co|tiny\.cc/gi, weight: 90, reason: 'Shortened URL - High risk phishing link' },
  { pattern: /click\.here|tap\.here|open\.now|visit\.now|go\.to/gi, weight: 80, reason: 'Urgent link instruction - Phishing attempt' },
  { pattern: /http[s]?:\/\/[^\s]+\.(?!gov\.in|nic\.in|amazon\.in|flipkart\.com)[a-z]{2,}/gi, weight: 75, reason: 'Suspicious external link detected' },
  { pattern: /download\s+app\s+from|install\s+app.*?link/gi, weight: 85, reason: 'Fake app download link - Malware risk' },
  
  // Direct credential requests (NEVER legitimate)
  { pattern: /share\s+(your\s+)?(otp|pin|cvv|password|mpin|t-?pin|atm\s+pin)/gi, weight: 100, reason: 'CRITICAL: Direct request for credentials' },
  { pattern: /send\s+(your\s+)?(otp|pin|cvv|password|mpin|t-?pin)/gi, weight: 100, reason: 'CRITICAL: Direct request for credentials' },
  { pattern: /enter\s+(your\s+)?(otp|pin|cvv|password|mpin)/gi, weight: 95, reason: 'CRITICAL: Credential entry request' },
  { pattern: /provide\s+(your\s+)?(otp|pin|cvv|password|mpin)/gi, weight: 95, reason: 'CRITICAL: Credential request' },
  { pattern: /what\s+is\s+(your|the)\s+(otp|pin|cvv|password)/gi, weight: 100, reason: 'CRITICAL: Direct credential query' },
  { pattern: /tell\s+(me|us)\s+(your|the)\s+(otp|pin|cvv)/gi, weight: 100, reason: 'CRITICAL: Credential query' },
  { pattern: /sms\s+(me|back).*?(otp|pin|code)/gi, weight: 100, reason: 'CRITICAL: SMS back OTP scam' },
  
  // Money transfer scams
  { pattern: /send\s+money|transfer\s+money|pay\s+now|send\s+₹|send\s+rs|transfer\s+₹|transfer\s+rs/gi, weight: 90, reason: 'CRITICAL: Direct money transfer request' },
  { pattern: /refund.*?(otp|pin|cvv|code|number)/gi, weight: 95, reason: 'CRITICAL: Fake refund scam' },
  { pattern: /reverse.*?(transaction|payment).*?(otp|pin|code)/gi, weight: 95, reason: 'CRITICAL: Fake reversal scam' },
  { pattern: /cancel.*?(order|transaction).*?(otp|pin|code)/gi, weight: 90, reason: 'CRITICAL: Fake cancellation scam' },
  { pattern: /wrong\s+transaction.*?(otp|pin|code)/gi, weight: 95, reason: 'CRITICAL: Wrong transaction scam' },
  { pattern: /return.*?money.*?(otp|pin|account)/gi, weight: 90, reason: 'CRITICAL: Fake money return scam' },
  
  // Lottery/Prize scams (100% fraud in India)
  { pattern: /you\s+(have\s+)?won|congratulations.*?(prize|reward|lottery|bumper)/gi, weight: 100, reason: 'CRITICAL: Lottery/Prize scam' },
  { pattern: /selected\s+as\s+(winner|lucky|finalist)/gi, weight: 100, reason: 'CRITICAL: Fake winner notification' },
  { pattern: /(kbc|kaun\s+banega\s+crorepati).*?(winner|selected|prize)/gi, weight: 100, reason: 'CRITICAL: Fake KBC lottery scam' },
  { pattern: /₹\s*\d+\s*(lakh|crore|lac).*?(won|prize|winner)/gi, weight: 100, reason: 'CRITICAL: Large prize amount scam' },
  { pattern: /lucky\s+draw.*?(winner|selected)/gi, weight: 100, reason: 'CRITICAL: Lucky draw scam' },
  { pattern: /mega\s+prize|jackpot|bumper\s+prize/gi, weight: 100, reason: 'CRITICAL: Mega prize scam' },
  
  // Government/Official impersonation
  { pattern: /aadhar.*?(update|verify|block|suspend|expire|deactivate)/gi, weight: 90, reason: 'CRITICAL: Fake Aadhar update scam' },
  { pattern: /pan\s+card.*?(update|verify|block|invalid|expire)/gi, weight: 90, reason: 'CRITICAL: Fake PAN card scam' },
  { pattern: /income\s+tax.*?(refund|notice|verify|penalty|assessment)/gi, weight: 85, reason: 'Fake income tax communication' },
  { pattern: /eci\s+voter|election\s+commission.*?(update|verify)/gi, weight: 85, reason: 'Fake election commission scam' },
  { pattern: /e-?filing.*?(update|verify|refund)/gi, weight: 80, reason: 'Fake e-filing scam' },
  { pattern: /gst.*?(registration|refund|update|notice)/gi, weight: 80, reason: 'Fake GST scam' },
  { pattern: /ration\s+card.*?(update|verify|cancel)/gi, weight: 85, reason: 'Fake ration card scam' },
  { pattern: /voter\s+id.*?(update|verify|delete)/gi, weight: 85, reason: 'Fake voter ID scam' },
  { pattern: /passport.*?(expire|renew|verify|cancel)/gi, weight: 80, reason: 'Fake passport scam' },
  { pattern: /driving\s+licen[cs]e.*?(suspend|expire|renew)/gi, weight: 80, reason: 'Fake driving license scam' },
  
  // Account takeover attempts
  { pattern: /someone.*?(login|access|tried|attempt).*?(account)/gi, weight: 85, reason: 'Fake security alert - Account takeover' },
  { pattern: /suspicious\s+activity.*?(account|login|transaction)/gi, weight: 80, reason: 'Fake suspicious activity alert' },
  { pattern: /unauthorized.*?(access|login|transaction)/gi, weight: 80, reason: 'Fake unauthorized access alert' },
  { pattern: /security\s+breach|data\s+breach/gi, weight: 85, reason: 'Fake security breach alert' },
  
  // Remote access scams
  { pattern: /anydesk|teamviewer|remote|screen\s+share/gi, weight: 95, reason: 'CRITICAL: Remote access scam - Screen sharing' },
  { pattern: /install.*?(app|software).*?(help|refund|support)/gi, weight: 90, reason: 'CRITICAL: Malware installation attempt' },
];

// HIGH RISK PATTERNS (60-79% weight)
const highRiskPatterns = [
  // Banking fraud
  { pattern: /account\s+(will\s+be\s+)?(block|suspend|close|deactivat)/gi, weight: 75, reason: 'Account threat - Banking fraud' },
  { pattern: /kyc.*?(expire|update|complet|verify|pending)/gi, weight: 75, reason: 'Fake KYC update scam' },
  { pattern: /re-?kyc|e-?kyc\s+update/gi, weight: 75, reason: 'Fake KYC verification' },
  { pattern: /credit\s+card.*?(block|expire|limit)/gi, weight: 70, reason: 'Credit card scare tactic' },
  { pattern: /debit\s+card.*?(block|expire|update)/gi, weight: 70, reason: 'Debit card scare tactic' },
  { pattern: /netbanking.*?(suspend|block|disable)/gi, weight: 75, reason: 'Netbanking threat scam' },
  { pattern: /mobile\s+banking.*?(block|disable|suspend)/gi, weight: 75, reason: 'Mobile banking threat scam' },
  
  // UPI and digital payment scams
  { pattern: /paytm.*?(kyc|update|verify|suspend)/gi, weight: 75, reason: 'Fake Paytm verification' },
  { pattern: /phonepe.*?(kyc|update|verify|suspend)/gi, weight: 75, reason: 'Fake PhonePe verification' },
  { pattern: /google\s+pay.*?(kyc|update|verify|suspend)/gi, weight: 75, reason: 'Fake Google Pay verification' },
  { pattern: /bhim.*?(kyc|update|verify|suspend)/gi, weight: 70, reason: 'Fake BHIM UPI scam' },
  { pattern: /upi.*?(pin|password|security)/gi, weight: 75, reason: 'UPI credential request' },
  { pattern: /wallet.*?(blocked|suspend|verify)/gi, weight: 70, reason: 'Digital wallet scam' },
  
  // Job/Employment scams
  { pattern: /work\s+from\s+home.*?(₹|rs\.|earn|income)/gi, weight: 70, reason: 'Work from home scam' },
  { pattern: /part\s+time.*?(job|earn|income|₹)/gi, weight: 70, reason: 'Part-time job scam' },
  { pattern: /earn.*?(₹\s*\d+|rs\.\s*\d+)\s*(daily|per\s+day|week)/gi, weight: 70, reason: 'Unrealistic earning promise' },
  { pattern: /registration\s+fee.*?(job|position)/gi, weight: 75, reason: 'Job registration fee scam' },
  { pattern: /training\s+fee.*?(job|employment)/gi, weight: 75, reason: 'Fake job training fee scam' },
  { pattern: /data\s+entry.*?(work|job|earn)/gi, weight: 65, reason: 'Data entry job scam' },
  { pattern: /online\s+typing.*?(job|work|earn)/gi, weight: 65, reason: 'Online typing job scam' },
  { pattern: /survey.*?(earn|money|income|₹)/gi, weight: 60, reason: 'Paid survey scam' },
  
  // Investment/Trading scams
  { pattern: /trading.*?(account|profit|guaranteed)/gi, weight: 70, reason: 'Fake trading opportunity' },
  { pattern: /invest.*?(guaranteed|double|triple)/gi, weight: 75, reason: 'Fake investment scheme' },
  { pattern: /crypto.*?(profit|guaranteed|invest)/gi, weight: 70, reason: 'Cryptocurrency scam' },
  { pattern: /binary\s+option|forex.*?profit/gi, weight: 75, reason: 'Forex/Binary trading scam' },
  { pattern: /stock.*?(tip|sure|guaranteed|profit)/gi, weight: 65, reason: 'Stock market scam' },
  { pattern: /mlm|multi-?level\s+market/gi, weight: 70, reason: 'MLM/Pyramid scheme' },
  { pattern: /network\s+market.*?(join|invest)/gi, weight: 70, reason: 'Network marketing scam' },
  
  // Delivery/Package scams
  { pattern: /package.*?(deliver|pending|custom)/gi, weight: 65, reason: 'Fake delivery notification' },
  { pattern: /courier.*?(pending|custom|pay)/gi, weight: 65, reason: 'Fake courier scam' },
  { pattern: /customs?\s+(duty|charge|clear)/gi, weight: 70, reason: 'Fake customs clearance scam' },
  { pattern: /shipment.*?(held|pending|charge)/gi, weight: 65, reason: 'Fake shipment scam' },
  { pattern: /parcel.*?(undeliver|return|charge)/gi, weight: 65, reason: 'Fake parcel scam' },
  
  // Romance/Relationship scams
  { pattern: /friend.*?request.*?(accept|approve)/gi, weight: 60, reason: 'Fake friend request scam' },
  { pattern: /beautiful.*?(girl|lady|woman).*?(chat|talk)/gi, weight: 65, reason: 'Romance scam attempt' },
  { pattern: /dating.*?(site|app|profile)/gi, weight: 60, reason: 'Fake dating scam' },
  { pattern: /lonely.*?(chat|friend|talk)/gi, weight: 60, reason: 'Romance/loneliness scam' },
  
  // Medical/Health scams
  { pattern: /covid.*?(vaccine|test|medicine).*?(book|order)/gi, weight: 70, reason: 'COVID-19 related scam' },
  { pattern: /medicine.*?(deliver|urgent|emergency)/gi, weight: 65, reason: 'Fake medicine delivery scam' },
  { pattern: /health.*?(emergency|critical|urgent)/gi, weight: 60, reason: 'Medical emergency scam' },
  { pattern: /hospital.*?(bill|payment|urgent)/gi, weight: 65, reason: 'Fake hospital bill scam' },
  
  // Insurance scams
  { pattern: /insurance.*?(claim|refund|bonus)/gi, weight: 65, reason: 'Fake insurance claim' },
  { pattern: /policy.*?(mature|bonus|claim)/gi, weight: 65, reason: 'Fake insurance policy scam' },
  { pattern: /lic.*?(bonus|maturity|claim)/gi, weight: 65, reason: 'Fake LIC scam' },
  
  // Education scams
  { pattern: /admission.*?(confirm|seat|college)/gi, weight: 60, reason: 'Fake admission scam' },
  { pattern: /scholarship.*?(select|approve|won)/gi, weight: 70, reason: 'Fake scholarship scam' },
  { pattern: /exam.*?(result|pass|certificate)/gi, weight: 55, reason: 'Fake exam result scam' },
  { pattern: /degree.*?(online|easy|quick)/gi, weight: 65, reason: 'Fake degree scam' },
  
  // SIM swap / OTP bypass scams
  { pattern: /sim.*?(swap|change|block|deactivate)/gi, weight: 75, reason: 'SIM swap scam warning' },
  { pattern: /port.*?(number|sim|mobile)/gi, weight: 70, reason: 'Number porting scam' },
  { pattern: /receive.*?call.*?(otp|code|pin)/gi, weight: 80, reason: 'OTP over call scam' },
  
  // Fake customer support
  { pattern: /customer\s+(care|support|service).*?(number|call|contact)/gi, weight: 65, reason: 'Fake customer support scam' },
  { pattern: /helpline.*?(number|call|contact)/gi, weight: 60, reason: 'Fake helpline scam' },
  { pattern: /toll-?free.*?(number|call)/gi, weight: 60, reason: 'Fake toll-free number scam' },
  
  // Property/Real Estate scams
  { pattern: /property.*?(deal|invest|buy)/gi, weight: 60, reason: 'Property investment scam' },
  { pattern: /flat.*?(booking|discount|offer)/gi, weight: 60, reason: 'Fake flat booking scam' },
  { pattern: /plot.*?(sale|cheap|offer)/gi, weight: 60, reason: 'Land plot scam' },
  
  // Rental scams
  { pattern: /rent.*?(house|flat|room).*?(urgent|immediate)/gi, weight: 60, reason: 'Rental scam' },
  { pattern: /pg.*?(room|bed|urgent)/gi, weight: 55, reason: 'PG accommodation scam' },
  
  // Loan scams
  { pattern: /instant.*?loan|loan.*?(approved|sanction)/gi, weight: 65, reason: 'Instant loan scam' },
  { pattern: /loan.*?processing.*?fee/gi, weight: 70, reason: 'Loan processing fee scam' },
  { pattern: /loan.*?(guarantee|assured)/gi, weight: 65, reason: 'Guaranteed loan scam' },
  { pattern: /personal.*?loan.*?(urgent|instant)/gi, weight: 65, reason: 'Personal loan scam' },
  
  // Charity/Donation scams
  { pattern: /donate|donation.*?(urgent|help|needy)/gi, weight: 60, reason: 'Fake charity/donation scam' },
  { pattern: /help.*?(poor|needy|urgent).*?(donate|fund)/gi, weight: 60, reason: 'Fake help request scam' },
];

// MEDIUM RISK PATTERNS (40-59% weight)
const mediumRiskPatterns = [
  // Verification/Update requests
  { pattern: /verify\s+your|verify\s+account/gi, weight: 50, reason: 'Verification request' },
  { pattern: /update\s+your|update\s+account/gi, weight: 50, reason: 'Update request' },
  { pattern: /confirm\s+your|confirm\s+account/gi, weight: 50, reason: 'Confirmation request' },
  
  // Urgent action required
  { pattern: /action\s+required|immediate\s+action/gi, weight: 45, reason: 'Urgency tactics' },
  { pattern: /within\s+\d+\s+hours?|within\s+\d+\s+days?/gi, weight: 40, reason: 'Time pressure tactic' },
  { pattern: /today\s+only|last\s+chance|final\s+notice/gi, weight: 45, reason: 'Deadline pressure' },
  
  // Account information requests
  { pattern: /account\s+number|bank\s+details|card\s+details/gi, weight: 55, reason: 'Account information request' },
  { pattern: /personal\s+info|personal\s+details/gi, weight: 50, reason: 'Personal information request' },
  
  // Discount/Offer lures
  { pattern: /limited.*?offer|exclusive.*?offer/gi, weight: 40, reason: 'Limited time offer lure' },
  { pattern: /\d+%\s+off|discount.*?(expire|today)/gi, weight: 40, reason: 'Discount pressure tactic' },
  
  // Generic banking terms
  { pattern: /\btransaction\b/gi, weight: 25, reason: 'Transaction mention' },
  { pattern: /\bpayment\b/gi, weight: 25, reason: 'Payment mention' },
];

// LOW RISK PATTERNS (20-39% weight)
const lowRiskPatterns = [
  // Generic urgency
  { pattern: /immediately/gi, weight: 25, reason: 'Creates false urgency' },
  { pattern: /urgent/gi, weight: 25, reason: 'Creates false urgency' },
  { pattern: /\bnow\b/gi, weight: 25, reason: 'Creates false urgency' },
  
  // Exclamation marks
  { pattern: /!{2,}/g, weight: 15, reason: 'Multiple exclamation marks' },
  
  // All caps
  { pattern: /[A-Z]{10,}/g, weight: 15, reason: 'Excessive capitalization' },
  
  // Generic call to action
  { pattern: /call\s+(us|now|back)/gi, weight: 30, reason: 'Callback request' },
  { pattern: /contact\s+(us|support)/gi, weight: 25, reason: 'Contact request' },
  { pattern: /reply.*?(yes|no|y\/n)/gi, weight: 30, reason: 'Reply request' },
];

// HINDI/HINGLISH FRAUD PATTERNS
const hindiPatterns = [
  // Critical Hindi patterns - OTP/Credential requests
  { pattern: /otp\s+(share|bataye|bheje|dijiye|send)/gi, weight: 100, reason: 'Hindi: Direct OTP/PIN request' },
  { pattern: /pin\s+(bataye|bheje|dijiye|share)/gi, weight: 100, reason: 'Hindi: Direct PIN request' },
  { pattern: /password\s+(bataye|bheje|dijiye)/gi, weight: 100, reason: 'Hindi: Password request' },
  { pattern: /cvv\s+(number|bataye|bheje)/gi, weight: 100, reason: 'Hindi: CVV request' },
  
  // Account blocking threats
  { pattern: /aapka\s+account.*?(band|block|suspend|close)/gi, weight: 85, reason: 'Hindi: Account blocking threat' },
  { pattern: /khata.*?(band|block|suspend)/gi, weight: 85, reason: 'Hindi: Bank account threat' },
  { pattern: /account.*?(band\s+ho|block\s+ho)/gi, weight: 85, reason: 'Hindi: Account will be blocked threat' },
  
  // Urgency words
  { pattern: /turant|jaldi|abhi\s+hi|foran/gi, weight: 30, reason: 'Hindi: Urgency words' },
  { pattern: /aaj\s+hi|2\s+ghante|24\s+ghante/gi, weight: 35, reason: 'Hindi: Time pressure tactic' },
  
  // Lottery/Prize scams
  { pattern: /badhai\s+ho|mubarak\s+ho/gi, weight: 90, reason: 'Hindi: Congratulations - Likely lottery scam' },
  { pattern: /inaam.*?(jeeta|mila|jeet)/gi, weight: 95, reason: 'Hindi: Prize won scam' },
  { pattern: /lottery.*?(jeeta|winner|select)/gi, weight: 100, reason: 'Hindi: Lottery scam' },
  { pattern: /crore|lakh.*?(jeeta|jeet|inaam)/gi, weight: 100, reason: 'Hindi: Large prize scam' },
  { pattern: /lucky\s+draw.*?(jeeta|select)/gi, weight: 100, reason: 'Hindi: Lucky draw scam' },
  
  // Money/Payment
  { pattern: /paisa.*?(bheje|send|transfer)/gi, weight: 85, reason: 'Hindi: Money transfer request' },
  { pattern: /rupay.*?(bheje|send|transfer)/gi, weight: 85, reason: 'Hindi: Money sending request' },
  { pattern: /paise.*?(wapas|refund|return)/gi, weight: 75, reason: 'Hindi: Fake refund scam' },
  
  // KYC/Document scams
  { pattern: /kyc.*?(update|pending|complete|kare)/gi, weight: 75, reason: 'Hindi: KYC scam' },
  { pattern: /re-?kyc.*?(kare|update)/gi, weight: 75, reason: 'Hindi: Re-KYC scam' },
  { pattern: /document.*?(update|verify|kare)/gi, weight: 70, reason: 'Hindi: Document update scam' },
  
  // Aadhar/PAN scams
  { pattern: /aadhar.*?(update|verify|band|expire)/gi, weight: 85, reason: 'Hindi: Fake Aadhar update' },
  { pattern: /pan\s+card.*?(update|verify|band)/gi, weight: 85, reason: 'Hindi: Fake PAN update' },
  { pattern: /aadhaar.*?(block|suspend|invalid)/gi, weight: 85, reason: 'Hindi: Aadhar blocking threat' },
  
  // Job scams
  { pattern: /ghar\s+baithe.*?(kamaye|earn|paise)/gi, weight: 70, reason: 'Hindi: Work from home scam' },
  { pattern: /part\s+time.*?(kaam|job|kamaye)/gi, weight: 70, reason: 'Hindi: Part-time job scam' },
  { pattern: /rozana.*?(kamaye|earn|income)/gi, weight: 70, reason: 'Hindi: Daily earning scam' },
  { pattern: /registration.*?(fees|charge|shulk)/gi, weight: 75, reason: 'Hindi: Registration fee scam' },
  
  // Investment scams
  { pattern: /invest.*?(kare|kariye|double|guaranteed)/gi, weight: 75, reason: 'Hindi: Investment scam' },
  { pattern: /trading.*?(account|profit|pakka)/gi, weight: 70, reason: 'Hindi: Trading scam' },
  
  // Link clicking
  { pattern: /link.*?(click|open|kholo)/gi, weight: 75, reason: 'Hindi: Link clicking instruction' },
  { pattern: /click.*?(kare|kariye|karo)/gi, weight: 75, reason: 'Hindi: Click instruction' },
  
  // Verification/Confirmation
  { pattern: /verify.*?(kare|kariye|kijiye)/gi, weight: 60, reason: 'Hindi: Verification request' },
  { pattern: /confirm.*?(kare|kariye|kijiye)/gi, weight: 60, reason: 'Hindi: Confirmation request' },
  { pattern: /update.*?(kare|kariye|kijiye)/gi, weight: 60, reason: 'Hindi: Update request' },
  
  // Call back requests
  { pattern: /call.*?(kare|back|wapas)/gi, weight: 55, reason: 'Hindi: Call back request' },
  { pattern: /phone.*?(kare|kariye)/gi, weight: 50, reason: 'Hindi: Phone request' },
  { pattern: /contact.*?(kare|kariye)/gi, weight: 50, reason: 'Hindi: Contact request' },
  
  // Gift/Reward
  { pattern: /tohfa|gift|reward.*?(mila|jeeta)/gi, weight: 90, reason: 'Hindi: Gift/Reward scam' },
  { pattern: /cashback.*?(mila|claim)/gi, weight: 65, reason: 'Hindi: Cashback scam' },
  
  // Police/Legal threats
  { pattern: /police|kanoon|legal.*?(action|karyawahi)/gi, weight: 75, reason: 'Hindi: Police/Legal threat scam' },
  { pattern: /giraftar|arrest|jail/gi, weight: 80, reason: 'Hindi: Arrest threat scam' },
  
  // Tax scams
  { pattern: /tax.*?(refund|wapas|return)/gi, weight: 80, reason: 'Hindi: Tax refund scam' },
  { pattern: /income\s+tax.*?(notice|refund)/gi, weight: 80, reason: 'Hindi: Income tax scam' },
];

// SUSPICIOUS SENDER PATTERNS
const suspiciousSenderPatterns = [
  // Random alphanumeric patterns
  { pattern: /^[A-Z]{2}-[A-Z0-9]{6,}$/i, weight: 35, reason: 'Suspicious sender ID format' },
  { pattern: /^[0-9]{5,6}$/, weight: 40, reason: 'Short code - Unverified sender' },
  { pattern: /^\+?\d{10,15}$/, weight: 45, reason: 'Personal mobile number as sender' },
  
  // Scam keyword senders
  { pattern: /PRIZE|REWARD|WINNER|LOTTERY|GIFT/i, weight: 85, reason: 'Prize/Lottery sender - 100% scam' },
  { pattern: /KBC|CROREPATI/i, weight: 90, reason: 'Fake KBC sender' },
  { pattern: /INCOME.*TAX|IT-DEPT/i, weight: 70, reason: 'Fake Income Tax sender' },
  { pattern: /AADHAR|UIDAI/i, weight: 70, reason: 'Fake Aadhar sender' },
  { pattern: /LOAN|CREDIT/i, weight: 50, reason: 'Unsolicited loan sender' },
  { pattern: /JOB|HIRE|VACANCY/i, weight: 55, reason: 'Job scam sender' },
];

// LEGITIMATE SENDERS (Whitelist - Verified Indian services)
const legitimateSenders = [
  // Banks
  /^SBIINB$/i, /^VK-SBIINB$/i, /^SBIPSG$/i,
  /^HDFCBK$/i, /^VK-HDFCBK$/i, /^HDFCBA$/i,
  /^ICICIB$/i, /^VK-ICICIB$/i, /^ICICBA$/i,
  /^AXISBK$/i, /^TX-AXISBK$/i, /^AXISCRD$/i,
  /^KOTAKB$/i, /^KOTAKM$/i,
  /^PNBSMS$/i, /^PNBBKG$/i,
  /^BOIIND$/i, /^CBSSBI$/i,
  /^INDUSB$/i, /^YESBNK$/i,
  /^IDFCFB$/i, /^RBLBNK$/i,
  
  // UPI/Payment services
  /^PAYTMB$/i, /^PYTMRC$/i,
  /^PHONEPE$/i, /^PHPERC$/i,
  /^GOOGLEPAY$/i, /^GPAY$/i,
  /^BHIM$/i, /^NPCIUPI$/i,
  
  // E-commerce
  /^AMZIND$/i, /^AMAZON$/i,
  /^FKSHOP$/i, /^FLIPKART$/i,
  /^MYNTRA$/i, /^AJIORC$/i,
  /^SNAPDL$/i, /^BIGBSK$/i,
  
  // Telecom
  /^AIRTEL$/i, /^VM-AIRTEL$/i, /^MYAIRT$/i,
  /^VODAIN$/i, /^MYIDEA$/i, /^VICARE$/i,
  /^JIOINF$/i, /^MYJIO$/i,
  /^BSNLMO$/i,
  
  // Food delivery
  /^SWIGGY$/i, /^ZOMATO$/i,
  /^DUNKIN$/i, /^DOMINOS$/i,
  
  // Travel
  /^IRCTC$/i, /^MAKEMY$/i,
  /^GOIBIBO$/i, /^YATRA$/i,
  /^OLA$/i, /^UBER$/i,
  
  // Government (Real)
  /^GOVTIN$/i, /^UIDAI$/i,
  /^ECISVEEP$/i,
  
  // Utilities
  /^BESCOM$/i, /^MSEDCL$/i,
  /^TATASKY$/i, /^DISHTV$/i,
];

// TRANSACTIONAL KEYWORDS (Reduce score for legitimate senders)
const transactionalKeywords = [
  'credited', 'debited', 'balance', 'transaction', 
  'txn', 'deposit', 'withdrawal', 'transfer',
  'bill payment', 'recharge', 'successful',
  'confirmed', 'reference number', 'ref no',
  'available balance', 'a/c', 'account statement'
];

// COMBINE ALL PATTERNS
const allFraudPatterns = [
  ...criticalPatterns,
  ...highRiskPatterns,
  ...mediumRiskPatterns,
  ...lowRiskPatterns,
  ...hindiPatterns,
];

// ============================================
// MAIN FRAUD ANALYSIS FUNCTION
// ============================================

export function analyzeSMS(sender: string, content: string): SMSMessage {
  let fraudScore = 0;
  const reasons: string[] = [];
  
  console.log('========================================');
  console.log('🔍 ADVANCED FRAUD DETECTION ANALYSIS');
  console.log('========================================');
  console.log('📤 Sender:', sender);
  console.log('📝 Content:', content.substring(0, 100) + '...');
  console.log('========================================');
  
  // STEP 1: Check if sender is legitimate
  const isLegitimate = legitimateSenders.some(pattern => pattern.test(sender));
  console.log('✅ Legitimate Sender:', isLegitimate ? 'YES ✓' : 'NO ✗');
  
  // STEP 2: Check for transactional content
  const isTransactional = isLegitimate && transactionalKeywords.some(keyword =>
    content.toLowerCase().includes(keyword)
  );
  console.log('💳 Transactional:', isTransactional ? 'YES ✓' : 'NO ✗');
  
  // STEP 3: Analyze content against fraud patterns
  console.log('\n🎯 Pattern Matching:');
  console.log('-----------------------------------');
  
  let patternMatchCount = 0;
  allFraudPatterns.forEach(({ pattern, weight, reason }) => {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      fraudScore += weight;
      patternMatchCount++;
      
      if (!reasons.includes(reason)) {
        reasons.push(reason);
      }
      
      console.log(`🚨 MATCH: ${pattern.source.substring(0, 30)}...`);
      console.log(`   Weight: +${weight} | Reason: ${reason}`);
    }
  });
  
  console.log('-----------------------------------');
  console.log(`📊 Total Patterns Matched: ${patternMatchCount}`);
  console.log(`📈 Score after content check: ${fraudScore}`);
  
  // STEP 4: Analyze sender (only if not whitelisted)
  if (!isLegitimate) {
    console.log('\n📤 Sender Analysis:');
    console.log('-----------------------------------');
    
    suspiciousSenderPatterns.forEach(({ pattern, weight, reason }) => {
      if (pattern.test(sender)) {
        fraudScore += weight;
        if (!reasons.includes(reason)) {
          reasons.push(reason);
        }
        console.log(`⚠️ SENDER MATCH: ${pattern.source}`);
        console.log(`   Weight: +${weight} | Reason: ${reason}`);
      }
    });
    
    console.log('-----------------------------------');
  }
  
  console.log(`📈 Score after sender check: ${fraudScore}`);
  
  // STEP 5: Adjust for legitimate transactional messages
  if (isTransactional) {
    console.log('\n✅ LEGITIMATE TRANSACTION DETECTED');
    console.log(`🔽 Reducing score by 70 points`);
    fraudScore = Math.max(0, fraudScore - 70);
  }
  
  // STEP 6: Bonus penalties for multiple high-risk indicators
  if (patternMatchCount >= 5) {
    const bonusPenalty = 20;
    fraudScore += bonusPenalty;
    console.log(`\n⚠️ MULTIPLE INDICATORS: +${bonusPenalty} bonus penalty`);
  }
  
  // STEP 7: Cap score at 100
  fraudScore = Math.max(0, Math.min(fraudScore, 100));
  
  // STEP 8: Determine risk level
  const isScam = fraudScore >= 50;
  let riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'safe';
  
  if (fraudScore >= 80) riskLevel = 'critical';
  else if (fraudScore >= 60) riskLevel = 'high';
  else if (fraudScore >= 40) riskLevel = 'medium';
  else if (fraudScore >= 20) riskLevel = 'low';
  else riskLevel = 'safe';
  
  const riskLevelDisplay = 
    fraudScore >= 80 ? '🔴 CRITICAL DANGER' :
    fraudScore >= 60 ? '🟠 HIGH RISK' :
    fraudScore >= 40 ? '🟡 SUSPICIOUS' :
    fraudScore >= 20 ? '🟢 CAUTION' :
    '✅ SAFE';
  
  console.log('\n========================================');
  console.log('📊 FINAL ANALYSIS RESULTS');
  console.log('========================================');
  console.log(`🎯 Fraud Score: ${fraudScore}%`);
  console.log(`⚠️ Risk Level: ${riskLevelDisplay}`);
  console.log(`❌ Is Scam: ${isScam ? 'YES ⚠️' : 'NO ✓'}`);
  console.log(`📝 Reasons Found: ${reasons.length}`);
  console.log('========================================\n');
  
  return {
    sender,
    content,
    fraudScore,
    reasons: reasons.slice(0, 5), // Limit to top 5 reasons
    timestamp: Date.now(),
    riskLevel,
  };
}
