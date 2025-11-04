import React from 'react';
import { Shield, Scan, Bot, BarChart3, Phone, MessageSquare, Clock, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Language, FraudStats, SMSMessage } from '../types';
import { t } from '../utils/translations';

interface DashboardProps {
  language: Language;
  stats: FraudStats;
  recentScans: SMSMessage[];
  onNavigate: (view: string) => void;
}

export function Dashboard({ language, stats, recentScans, onNavigate }: DashboardProps) {
  const detectionRate = stats.totalScanned > 0
    ? Math.round((stats.fraudDetected / stats.totalScanned) * 100)
    : 0;

  const quickActions = [
    {
      icon: Scan,
      label: t('quickScan', language),
      description: 'Analyze suspicious messages',
      onClick: () => onNavigate('scanner'),
    },
    {
      icon: Bot,
      label: t('askAI', language),
      description: 'Get security guidance',
      onClick: () => onNavigate('assistant'),
    },
    {
      icon: BarChart3,
      label: t('viewStats', language),
      description: 'View detailed analytics',
      onClick: () => onNavigate('analytics'),
    },
  ];

  const getRiskBadge = (score: number) => {
    if (score >= 60) return <Badge variant="destructive">{t('highRisk', language)}</Badge>;
    if (score >= 40) return <Badge className="bg-orange-500 text-white">{t('mediumRisk', language)}</Badge>;
    if (score >= 20) return <Badge className="bg-yellow-500 text-white">{t('lowRisk', language)}</Badge>;
    return <Badge className="bg-green-500 text-white">{t('safe', language)}</Badge>;
  };

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-8">
        <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-4">
          <Shield className="w-12 h-12 text-primary" />
        </div>
        <h1 className="mb-2">{t('welcome', language)}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t('welcomeDesc', language)}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Card
              key={idx}
              className="p-6 cursor-pointer hover:shadow-lg transition-all hover:border-primary group"
              onClick={action.onClick}
            >
              <div className="inline-flex p-3 bg-primary/10 rounded-lg mb-3 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="mb-1">{action.label}</h3>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </Card>
          );
        })}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">{t('totalScanned', language)}</span>
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <div className="text-3xl">{stats.totalScanned}</div>
          <p className="text-xs text-muted-foreground mt-1">Messages analyzed</p>
        </Card>

        <Card className="p-6 border-red-200 dark:border-red-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-red-600 dark:text-red-400">{t('fraudDetected', language)}</span>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl text-red-600 dark:text-red-400">{stats.fraudDetected}</div>
          <p className="text-xs text-muted-foreground mt-1">Threats blocked</p>
        </Card>

        <Card className="p-6 border-green-200 dark:border-green-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-green-600 dark:text-green-400">{t('safeMessages', language)}</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl text-green-600 dark:text-green-400">{stats.safeMessages}</div>
          <p className="text-xs text-muted-foreground mt-1">Verified safe</p>
        </Card>

        <Card className="p-6 border-blue-200 dark:border-blue-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-600 dark:text-blue-400">{t('detectionRate', language)}</span>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl text-blue-600 dark:text-blue-400">{detectionRate}%</div>
          <p className="text-xs text-muted-foreground mt-1">Accuracy rate</p>
        </Card>
      </div>

      {/* Recent Scans */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            {t('recentScans', language)}
          </h2>
          {recentScans.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('analytics')}
            >
              View All
            </Button>
          )}
        </div>

        {recentScans.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-4">
              <Scan className="w-8 h-8 text-primary" />
            </div>
            <h3 className="mb-2">{t('noScans', language)}</h3>
            <p className="text-muted-foreground mb-4">{t('scanFirst', language)}</p>
            <Button
              onClick={() => onNavigate('scanner')}
            >
              <Scan className="w-4 h-4 mr-2" />
              {t('scanSMS', language)}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentScans.slice(0, 5).map((scan) => (
              <div
                key={scan.id}
                className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium">{scan.sender}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {scan.content}
                    </div>
                  </div>
                  {getRiskBadge(scan.fraudScore)}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{scan.timestamp.toLocaleDateString()}</span>
                  <span>{scan.timestamp.toLocaleTimeString()}</span>
                  <Progress value={scan.fraudScore} className="flex-1 h-1.5" />
                  <span className="font-medium">{scan.fraudScore}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Emergency Contact Banner */}
      <Card className="p-6 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500 rounded-lg">
            <Phone className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-red-900 dark:text-red-100 mb-1">{t('emergencyContacts', language)}</h3>
            <p className="text-red-700 dark:text-red-300 text-sm mb-3">
              Report cyber fraud immediately to protect yourself and others
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-red-300 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300"
                onClick={() => window.open('tel:1930')}
              >
                Call 1930
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-300 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300"
                onClick={() => window.open('tel:100')}
              >
                Call 100
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-300 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300"
                onClick={() => window.open('tel:181')}
              >
                Call 181
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-300 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300"
                onClick={() => window.open('tel:1098')}
              >
                Call 1098
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
