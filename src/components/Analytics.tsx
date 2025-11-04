import React from 'react';
import { TrendingUp, Shield, AlertTriangle, CheckCircle, Calendar, BarChart3, MessageSquare } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Language, FraudStats, SMSMessage } from '../types';
import { t } from '../utils/translations';

interface AnalyticsProps {
  language: Language;
  stats: FraudStats;
  recentScans: SMSMessage[];
}

export function Analytics({ language, stats, recentScans }: AnalyticsProps) {
  const detectionRate = stats.totalScanned > 0
    ? Math.round((stats.fraudDetected / stats.totalScanned) * 100)
    : 0;

  const safeRate = stats.totalScanned > 0
    ? Math.round((stats.safeMessages / stats.totalScanned) * 100)
    : 0;

  const getRiskLevel = (score: number) => {
    if (score >= 60) return { label: t('highRisk', language), color: 'bg-red-500', count: 0 };
    if (score >= 40) return { label: t('mediumRisk', language), color: 'bg-orange-500', count: 0 };
    if (score >= 20) return { label: t('lowRisk', language), color: 'bg-yellow-500', count: 0 };
    return { label: t('safe', language), color: 'bg-green-500', count: 0 };
  };

  // Calculate risk distribution
  const riskDistribution = {
    high: recentScans.filter(s => s.fraudScore >= 60).length,
    medium: recentScans.filter(s => s.fraudScore >= 40 && s.fraudScore < 60).length,
    low: recentScans.filter(s => s.fraudScore >= 20 && s.fraudScore < 40).length,
    safe: recentScans.filter(s => s.fraudScore < 20).length,
  };

  // Get most common fraud patterns
  const allReasons = recentScans
    .filter(s => s.isScam)
    .flatMap(s => s.reasons);
  
  const reasonCounts = allReasons.reduce((acc, reason) => {
    acc[reason] = (acc[reason] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topReasons = Object.entries(reasonCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-4">
          <BarChart3 className="w-8 h-8 text-primary" />
        </div>
        <h1 className="mb-2">{t('analytics', language)}</h1>
        <p className="text-muted-foreground">
          {language === 'hi' ? 'व्यापक धोखाधड़ी पहचान अंतर्दृष्टि' : 'Comprehensive fraud detection insights'}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 border-2 border-primary/20 bg-primary/5">
          <div className="flex items-center justify-between mb-3">
            <MessageSquare className="w-8 h-8 text-primary" />
            <Badge className="bg-primary text-primary-foreground">{stats.totalScanned}</Badge>
          </div>
          <h3 className="mb-1">{t('totalScanned', language)}</h3>
          <p className="text-sm text-muted-foreground">
            {language === 'hi' ? 'संदेश विश्लेषित' : 'Messages analyzed'}
          </p>
        </Card>

        <Card className="p-6 border-2 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
          <div className="flex items-center justify-between mb-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <Badge className="bg-red-500 text-white">{stats.fraudDetected}</Badge>
          </div>
          <h3 className="mb-1">{t('fraudDetected', language)}</h3>
          <p className="text-sm text-muted-foreground">
            {language === 'hi' ? 'खतरे अवरुद्ध' : 'Threats blocked'}
          </p>
        </Card>

        <Card className="p-6 border-2 border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <Badge className="bg-green-500 text-white">{stats.safeMessages}</Badge>
          </div>
          <h3 className="mb-1">{t('safeMessages', language)}</h3>
          <p className="text-sm text-muted-foreground">
            {language === 'hi' ? 'सत्यापित सुरक्षित' : 'Verified safe'}
          </p>
        </Card>

        <Card className="p-6 border-2 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-8 h-8 text-blue-500" />
            <Badge className="bg-blue-500 text-white">{detectionRate}%</Badge>
          </div>
          <h3 className="mb-1">{t('detectionRate', language)}</h3>
          <p className="text-sm text-muted-foreground">
            {language === 'hi' ? 'सटीकता दर' : 'Accuracy rate'}
          </p>
        </Card>
      </div>

      {/* Risk Distribution */}
      <Card className="p-6">
        <h2 className="mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          {language === 'hi' ? 'जोखिम वितरण' : 'Risk Distribution'}
        </h2>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">{t('highRisk', language)}</span>
              <span className="text-sm font-medium">{riskDistribution.high}</span>
            </div>
            <Progress value={stats.totalScanned > 0 ? (riskDistribution.high / stats.totalScanned) * 100 : 0} className="h-2 bg-red-100 dark:bg-red-950" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">{t('mediumRisk', language)}</span>
              <span className="text-sm font-medium">{riskDistribution.medium}</span>
            </div>
            <Progress value={stats.totalScanned > 0 ? (riskDistribution.medium / stats.totalScanned) * 100 : 0} className="h-2 bg-orange-100 dark:bg-orange-950" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">{t('lowRisk', language)}</span>
              <span className="text-sm font-medium">{riskDistribution.low}</span>
            </div>
            <Progress value={stats.totalScanned > 0 ? (riskDistribution.low / stats.totalScanned) * 100 : 0} className="h-2 bg-yellow-100 dark:bg-yellow-950" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">{t('safe', language)}</span>
              <span className="text-sm font-medium">{riskDistribution.safe}</span>
            </div>
            <Progress value={stats.totalScanned > 0 ? (riskDistribution.safe / stats.totalScanned) * 100 : 0} className="h-2 bg-green-100 dark:bg-green-950" />
          </div>
        </div>
      </Card>

      {/* Top Fraud Patterns */}
      {topReasons.length > 0 && (
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            {language === 'hi' ? 'शीर्ष धोखाधड़ी पैटर्न' : 'Top Fraud Patterns'}
          </h2>
          
          <div className="space-y-3">
            {topReasons.map(([reason, count], idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-sm font-medium">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{reason}</p>
                  <Progress value={(count / stats.fraudDetected) * 100} className="h-1.5 mt-1" />
                </div>
                <span className="text-sm font-medium">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          {language === 'hi' ? 'हाल की गतिविधि' : 'Recent Activity'}
        </h2>
        
        {recentScans.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">{t('noScans', language)}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentScans.slice(0, 10).map((scan) => (
              <div
                key={scan.id}
                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${scan.isScam ? 'bg-red-100 dark:bg-red-950' : 'bg-green-100 dark:bg-green-950'}`}>
                  {scan.isScam ? (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{scan.sender}</span>
                    <Badge variant={scan.isScam ? 'destructive' : 'default'}>
                      {scan.fraudScore}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{scan.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {scan.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Last Scan Info */}
      {stats.lastScanDate && (
        <Card className="p-4 bg-accent/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              {language === 'hi' ? 'अंतिम स्कैन' : 'Last scan'}:{' '}
              {stats.lastScanDate.toLocaleString()}
            </span>
          </div>
        </Card>
      )}
    </div>
  );
}
