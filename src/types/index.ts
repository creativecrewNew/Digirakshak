export interface SMSMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  fraudScore: number;
  isScam: boolean;
  reasons: string[];
  language?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  language?: string;
}

export interface FraudPattern {
  pattern: RegExp;
  weight: number;
  reason: string;
}

export type Language = 
  | 'en' 
  | 'hi' 
  | 'pa' 
  | 'bho' 
  | 'har' 
  | 'ta' 
  | 'te' 
  | 'kn' 
  | 'ml' 
  | 'bn' 
  | 'gu';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

export interface FraudStats {
  totalScanned: number;
  fraudDetected: number;
  safeMessages: number;
  lastScanDate: Date | null;
}
