export type Language = 'en' | 'hi' | 'pa' | 'ta' | 'te' | 'kn' | 'ml' | 'bn' | 'gu' | 'bho' | 'hne';

export interface SMSMessage {
  sender: string;
  content: string;
  fraudScore: number;
  reasons: string[];
  timestamp?: number;
  riskLevel?: 'critical' | 'high' | 'medium' | 'low' | 'safe';
}

export interface CommunityPost {
  id: string;
  author: string;
  content: string;
  scamType: string;
  timestamp: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface AnalyticsData {
  totalScans: number;
  fraudDetected: number;
  safeSMS: number;
  lastScan?: number;
}
