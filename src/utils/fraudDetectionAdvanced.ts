import { FraudPattern, SMSMessage } from '../types';

// ============================================
// COMPREHENSIVE FRAUD DETECTION DATABASE
// ============================================
// Built for Indian context with 100+ patterns
// Covers all major fraud types in India

// CRITICAL FRAUD PATTERNS (80-100% weight)
const criticalPatterns: FraudPattern[] = [
  // Phishing URLs and suspicious links
  { pattern: /bit\.ly|tinyurl|goo\.gl|short\.link|ow\.ly|cutt\.ly|t\.co|tiny\.cc/gi, weight: 90, reason: 'Shortened URL - High risk phishing link' },
  { pattern: /click\.here|tap\.here|open\.now|visit\.now|go\.to/gi, weight: 80, reason: 'Urgent link instruction - Phishing attempt' },
  { pattern: /http[s]?:\/\/[^\\s]+\\.(?!gov\.in|nic\.in|amazon\.in|flipkart\.com)[a-z]{2,}/gi, weight: 75, reason: 'Suspicious external link detected' },
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
const highRiskPatterns: FraudPattern[] = [
  // Banking fraud
  { pattern: /account\\s+(will\\s+be\\s+)?(block|suspend|close|deactivat)/gi, weight: 75, reason: 'Account threat - Banking fraud' },
  { pattern: /kyc.*?(expire|update|complet|verify|pending)/gi, weight: 75, reason: 'Fake KYC update scam' },
  { pattern: /re-?kyc|e-?kyc\\s+update/gi, weight: 75, reason: 'Fake KYC verification' },
  { pattern: /credit\\s+card.*?(block|expire|limit)/gi, weight: 70, reason: 'Credit card scare tactic' },
  { pattern: /debit\\s+card.*?(block|expire|update)/gi, weight: 70, reason: 'Debit card scare tactic' },
  { pattern: /netbanking.*?(suspend|block|disable)/gi, weight: 75, reason: 'Netbanking threat scam' },
  { pattern: /mobile\\s+banking.*?(block|disable|suspend)/gi, weight: 75, reason: 'Mobile banking threat scam' },
  
  // UPI and digital payment scams
  { pattern: /paytm.*?(kyc|update|verify|suspend)/gi, weight: 75, reason: 'Fake Paytm verification' },
  { pattern: /phonepe.*?(kyc|update|verify|suspend)/gi, weight: 75, reason: 'Fake PhonePe verification' },
  { pattern: /google\\s+pay.*?(kyc|update|verify|suspend)/gi, weight: 75, reason: 'Fake Google Pay verification' },
  { pattern: /bhim.*?(kyc|update|verify|suspend)/gi, weight: 70, reason: 'Fake BHIM UPI scam' },
  { pattern: /upi.*?(pin|password|security)/gi, weight: 75, reason: 'UPI credential request' },
  { pattern: /wallet.*?(blocked|suspend|verify)/gi, weight: 70, reason: 'Digital wallet scam' },
  
  // Job/Employment scams
  { pattern: /work\\s+from\\s+home.*?(₹|rs\\.?|earn|income)/gi, weight: 70, reason: 'Work from home scam' },
  { pattern: /part\\s+time.*?(job|earn|income|₹)/gi, weight: 70, reason: 'Part-time job scam' },
  { pattern: /earn.*?(₹\\s*\\d+|rs\\.?\\s*\\d+)\\s*(daily|per\\s+day|week)/gi, weight: 70, reason: 'Unrealistic earning promise' },
  { pattern: /registration\\s+fee.*?(job|position)/gi, weight: 75, reason: 'Job registration fee scam' },
  { pattern: /training\\s+fee.*?(job|employment)/gi, weight: 75, reason: 'Fake job training fee scam' },
  { pattern: /data\\s+entry.*?(work|job|earn)/gi, weight: 65, reason: 'Data entry job scam' },
  { pattern: /online\\s+typing.*?(job|work|earn)/gi, weight: 65, reason: 'Online typing job scam' },
  { pattern: /survey.*?(earn|money|income|₹)/gi, weight: 60, reason: 'Paid survey scam' },
  
  // Investment/Trading scams
  { pattern: /trading.*?(account|profit|guaranteed)/gi, weight: 70, reason: 'Fake trading opportunity' },
  { pattern: /invest.*?(guaranteed|double|triple)/gi, weight: 75, reason: 'Fake investment scheme' },
  { pattern: /crypto.*?(profit|guaranteed|invest)/gi, weight: 70, reason: 'Cryptocurrency scam' },
  { pattern: /binary\\s+option|forex.*?profit/gi, weight: 75, reason: 'Forex/Binary trading scam' },
  { pattern: /stock.*?(tip|sure|guaranteed|profit)/gi, weight: 65, reason: 'Stock market scam' },
  { pattern: /mlm|multi-?level\\s+market/gi, weight: 70, reason: 'MLM/Pyramid scheme' },
  { pattern: /network\\s+market.*?(join|invest)/gi, weight: 70, reason: 'Network marketing scam' },
  
  // Delivery/Package scams
  { pattern: /package.*?(deliver|pending|custom)/gi, weight: 65, reason: 'Fake delivery notification' },
  { pattern: /courier.*?(pending|custom|pay)/gi, weight: 65, reason: 'Fake courier scam' },
  { pattern: /customs?\\s+(duty|charge|clear)/gi, weight: 70, reason: 'Fake customs clearance scam' },
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
  { pattern: /customer\\s+(care|support|service).*?(number|call|contact)/gi, weight: 65, reason: 'Fake customer support scam' },
  { pattern: /helpline.*?(number|call|contact)/gi, weight: 60, reason: 'Fake helpline scam' },
  { pattern: /toll-?free.*?(number|call)/gi, weight: 60, reason: 'Fake toll-free number scam' },
  
  // Property/Real Estate scams
  { pattern: /property.*?(deal|invest|buy)/gi, weight: 60, reason: 'Property investment scam' },
  { pattern: /flat.*?(booking|discount|offer)/gi, weight: 60, reason: 'Fake flat booking scam' },
  { pattern: /plot.*?(sale|cheap|offer)/gi, weight: 60, reason: 'Land plot scam' },
  
  // Rental scams
  { pattern: /rent.*?(house|flat|room).*?(urgent|immediate)/gi, weight: 60, reason: 'Rental scam' },
  { pattern: /pg.*?(room|bed|urgent)/gi, weight: 55, reason: 'PG accommodation scam' },
  { pattern: /advance.*?(deposit|payment).*?(rent|room)/gi, weight: 65, reason: 'Rental advance scam' },
  
  // Charity/Donation scams  
  { pattern: /donation.*?(help|urgent|emergency)/gi, weight: 65, reason: 'Fake charity/donation scam' },
  { pattern: /donate.*?(cause|help|support)/gi, weight: 60, reason: 'Fake donation request' },
  { pattern: /ngo.*?(help|donate|support)/gi, weight: 60, reason: 'Fake NGO scam' },
];

// MEDIUM RISK PATTERNS (40-59% weight)
const mediumRiskPatterns: FraudPattern[] = [
  // General banking keywords
  { pattern: /\b(otp|pin|cvv|password)\b/gi, weight: 50, reason: 'Sensitive credential mention' },
  { pattern: /account.*?(detail|number|info)/gi, weight: 45, reason: 'Account information request' },
  { pattern: /card.*?(detail|number|expiry)/gi, weight: 45, reason: 'Card information request' },
  
  // Verification/Update requests
  { pattern: /verify\s+(your\s+)?(account|detail|info)/gi, weight: 45, reason: 'Verification request' },
  { pattern: /update\s+(your\s+)?(account|detail|info)/gi, weight: 45, reason: 'Update request' },
  { pattern: /confirm\s+(your\s+)?(account|detail|identity)/gi, weight: 45, reason: 'Confirmation request' },
  { pattern: /validate\s+(your\s+)?(account|detail)/gi, weight: 45, reason: 'Validation request' },
  
  // Urgency tactics
  { pattern: /within\s+24\s+hours|next\s+24\s+hours/gi, weight: 40, reason: 'Artificial urgency - 24 hour deadline' },
  { pattern: /last\s+(chance|warning|reminder)/gi, weight: 45, reason: 'False urgency tactic' },
  { pattern: /expir(e|ing)\s+(today|soon|now)/gi, weight: 45, reason: 'Fake expiration urgency' },
  { pattern: /act\s+now|hurry|limited\s+time/gi, weight: 40, reason: 'Pressure tactic' },
  
  // Reward/Cashback offers
  { pattern: /cashback.*?(₹|rs\.?|rupee)/gi, weight: 45, reason: 'Suspicious cashback offer' },
  { pattern: /reward.*?(₹|rs\.?|point)/gi, weight: 45, reason: 'Suspicious reward offer' },
  { pattern: /free.*?(₹|rs\.?|gift|prize)/gi, weight: 50, reason: 'Free money/prize offer' },
  { pattern: /claim.*?(prize|reward|gift)/gi, weight: 50, reason: 'Prize claim request' },
  
  // Loan scams
  { pattern: /loan.*?(approved|sanction|instant)/gi, weight: 55, reason: 'Unsolicited loan offer' },
  { pattern: /credit.*?(₹|rs\.?).*?(approved|instant)/gi, weight: 55, reason: 'Instant credit offer' },
  { pattern: /personal\s+loan.*?(approved|low\s+interest)/gi, weight: 55, reason: 'Personal loan scam' },
];

// LOW RISK PATTERNS (20-39% weight)
const lowRiskPatterns: FraudPattern[] = [
  // Generic urgency words
  { pattern: /\bimmediately\b/gi, weight: 25, reason: 'Urgency indicator' },
  { pattern: /\burgent\b/gi, weight: 25, reason: 'Urgency indicator' },
  { pattern: /\bnow\b/gi, weight: 20, reason: 'Urgency indicator' },
  { pattern: /\basap\b/gi, weight: 25, reason: 'Urgency indicator' },
  
  // Generic financial terms
  { pattern: /\bbank\b/gi, weight: 30, reason: 'Banking context' },
  { pattern: /\baccount\b/gi, weight: 30, reason: 'Account mention' },
  { pattern: /\btransaction\b/gi, weight: 25, reason: 'Transaction mention' },
  { pattern: /\bpayment\b/gi, weight: 25, reason: 'Payment mention' },
  
  // Generic call to action
  { pattern: /call\s+(us|now|back)/gi, weight: 30, reason: 'Callback request' },
  { pattern: /contact\s+(us|support)/gi, weight: 25, reason: 'Contact request' },
  { pattern: /reply.*?(yes|no|y\/n)/gi, weight: 30, reason: 'Reply request' },
];

// HINDI/HINGLISH FRAUD PATTERNS
const hindiPatterns: FraudPattern[] = [
  // Critical Hindi patterns - OTP/Credential requests
  { pattern: /otp\\s+(share|bataye|bheje|dijiye|send)/gi, weight: 100, reason: 'Hindi: Direct OTP/PIN request' },
  { pattern: /pin\\s+(bataye|bheje|dijiye|share)/gi, weight: 100, reason: 'Hindi: Direct PIN request' },
  { pattern: /password\\s+(bataye|bheje|dijiye)/gi, weight: 100, reason: 'Hindi: Password request' },
  { pattern: /cvv\\s+(number|bataye|bheje)/gi, weight: 100, reason: 'Hindi: CVV request' },
  
  // Account blocking threats
  { pattern: /aapka\\s+account.*?(band|block|suspend|close)/gi, weight: 85, reason: 'Hindi: Account blocking threat' },
  { pattern: /khata.*?(band|block|suspend)/gi, weight: 85, reason: 'Hindi: Bank account threat' },
  { pattern: /account.*?(band\\s+ho|block\\s+ho)/gi, weight: 85, reason: 'Hindi: Account will be blocked threat' },
  
  // Urgency words
  { pattern: /turant|jaldi|abhi\\s+hi|foran/gi, weight: 30, reason: 'Hindi: Urgency words' },
  { pattern: /aaj\\s+hi|2\\s+ghante|24\\s+ghante/gi, weight: 35, reason: 'Hindi: Time pressure tactic' },
  
  // Lottery/Prize scams
  { pattern: /badhai\\s+ho|mubarak\\s+ho/gi, weight: 90, reason: 'Hindi: Congratulations - Likely lottery scam' },
  { pattern: /inaam.*?(jeeta|mila|jeet)/gi, weight: 95, reason: 'Hindi: Prize won scam' },
  { pattern: /lottery.*?(jeeta|winner|select)/gi, weight: 100, reason: 'Hindi: Lottery scam' },
  { pattern: /crore|lakh.*?(jeeta|jeet|inaam)/gi, weight: 100, reason: 'Hindi: Large prize scam' },
  { pattern: /lucky\\s+draw.*?(jeeta|select)/gi, weight: 100, reason: 'Hindi: Lucky draw scam' },
  
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
  { pattern: /pan\\s+card.*?(update|verify|band)/gi, weight: 85, reason: 'Hindi: Fake PAN update' },
  { pattern: /aadhaar.*?(block|suspend|invalid)/gi, weight: 85, reason: 'Hindi: Aadhar blocking threat' },
  
  // Job scams
  { pattern: /ghar\\s+baithe.*?(kamaye|earn|paise)/gi, weight: 70, reason: 'Hindi: Work from home scam' },
  { pattern: /part\\s+time.*?(kaam|job|kamaye)/gi, weight: 70, reason: 'Hindi: Part-time job scam' },
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
  { pattern: /income\\s+tax.*?(notice|refund)/gi, weight: 80, reason: 'Hindi: Income tax scam' },
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
  const detectedPatterns: string[] = [];
  
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
      
      detectedPatterns.push(pattern.toString());
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
  const riskLevel = 
    fraudScore >= 80 ? '🔴 CRITICAL DANGER' :
    fraudScore >= 60 ? '🟠 HIGH RISK' :
    fraudScore >= 40 ? '🟡 SUSPICIOUS' :
    fraudScore >= 20 ? '🟢 CAUTION' :
    '✅ SAFE';
  
  console.log('\n========================================');
  console.log('📊 FINAL ANALYSIS RESULTS');
  console.log('========================================');
  console.log(`🎯 Fraud Score: ${fraudScore}%`);
  console.log(`⚠️ Risk Level: ${riskLevel}`);
  console.log(`❌ Is Scam: ${isScam ? 'YES ⚠️' : 'NO ✓'}`);
  console.log(`📝 Reasons Found: ${reasons.length}`);
  console.log('========================================\n');
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    sender,
    content,
    timestamp: new Date(),
    fraudScore,
    isScam,
    reasons: reasons.slice(0, 5), // Limit to top 5 reasons
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getAlertMessage(language: string, fraudScore: number): string {
  const alerts: Record<string, Record<string, string>> = {
    en: {
      critical: "⚠️ CRITICAL DANGER! This is almost certainly a SCAM. DO NOT click any links, share OTP, PIN, CVV, or send money. Delete immediately and report to cybercrime at 1930.",
      high: "🚨 HIGH RISK SCAM! This message shows multiple fraud indicators. Do NOT click links, share personal info, or send money. Verify with official sources only.",
      medium: "⚠️ SUSPICIOUS MESSAGE! Warning signs detected. Be extremely cautious. Do not click links. Verify sender through official bank app or customer care.",
      low: "⚠️ BE CAREFUL! Some suspicious elements detected. Always verify sender authenticity before taking any action.",
      safe: "✅ This message appears safe, but always exercise caution with financial information.",
    },
    hi: {
      critical: "⚠️ गंभीर खतरा! यह निश्चित रूप से धोखाधड़ी है। किसी भी लिंक पर क्लिक न करें, OTP, PIN, CVV साझा न करें या पैसे न भेजें। तुरंत हटाएं और 1930 पर रिपोर्ट करें।",
      high: "🚨 उच्च जोखिम घोटाला! यह संदेश कई धोखाधड़ी संकेतक दिखाता है। लिंक पर क्लिक न करें, व्यक्तिगत जानकारी साझा न करें या पैसे न भेजें।",
      medium: "⚠️ संदिग्ध संदेश! चेतावनी के संकेत पाए गए। अत्यधिक सावधान रहें। लिंक पर क्लिक न करें। आधिकारिक बैंक ऐप से सत्यापित करें।",
      low: "⚠️ सावधान रहें! कुछ संदिग्ध तत्व पाए गए। कोई भी कार्रवाई करने से पहले प्रेषक की प्रामाणिकता सत्यापित करें।",
      safe: "✅ यह संदेश सुरक्षित लगता है, लेकिन वित्तीय जानकारी के साथ हमेशा सावधानी बरतें।",
    },
  };
  
  const level = 
    fraudScore >= 80 ? 'critical' : 
    fraudScore >= 60 ? 'high' : 
    fraudScore >= 40 ? 'medium' : 
    fraudScore >= 20 ? 'low' : 'safe';
  
  return alerts[language]?.[level] || alerts['en'][level];
}

export function getFraudTips(language: string): string[] {
  const tips: Record<string, string[]> = {
    en: [
      "🚫 NEVER share OTP, PIN, CVV with ANYONE - Banks never ask",
      "🏦 Banks NEVER ask for credentials via SMS or call",
      "🔗 Do NOT click links in unexpected SMS - Verify sender first",
      "💰 NO free lotteries/prizes exist - All are 100% scams",
      "📱 Verify through official bank app, NOT SMS links",
      "⏰ Ignore urgent deadlines - Scammers create false urgency",
      "🎯 KYC updates happen in bank, NOT via SMS",
      "📞 Call official helpline to verify suspicious messages",
      "🚨 Report fraud SMS to 1930 (Cybercrime helpline)",
      "✅ Real emergencies don't come via random SMS"
    ],
    hi: [
      "🚫 कभी भी OTP, पिन, CVV किसी के साथ साझा न करें - बैंक कभी नहीं मांगते",
      "🏦 बैंक SMS या कॉल से क्रेडेंशियल नहीं मांगते",
      "🔗 अप्रत्याशित SMS में लिंक पर क्लिक न करें - पहले सत्यापित करें",
      "💰 कोई मुफ्त लॉटरी/इनाम नहीं होता - सभी 100% घोटाले हैं",
      "📱 आधिकारिक बैंक ऐप से सत्यापित करें, SMS लिंक से नहीं",
      "⏰ जरूरी समय सीमा को अनदेखा करें - स्कैमर्स झूठी जल्दबाजी बनाते हैं",
      "🎯 KYC अपडेट बैंक में होते हैं, SMS से नहीं",
      "📞 संदिग्ध संदेशों को सत्यापित करने के लिए आधिकारिक हेल्पलाइन पर कॉल करें",
      "🚨 धोखाधड़ी SMS को 1930 (साइबर क्राइम हेल्पलाइन) पर रिपोर्ट करें",
      "✅ असली आपातकाल यादृच्छिक SMS से नहीं आते"
    ],
  };
  
  return tips[language] || tips['en'];
}

// Export patterns for testing/debugging
export { 
  allFraudPatterns, 
  suspiciousSenderPatterns, 
  legitimateSenders,
  transactionalKeywords 
};