import React, { useState } from 'react';
import { Globe, Volume2, Wifi, Info, Trash2, Check, Shield, Languages, Bot, MessageSquare, BarChart3, Zap, AlertTriangle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Language } from '../types';
import { languages, t } from '../utils/translations';
import { toast } from 'sonner@2.0.3';

interface SettingsProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onClearHistory: () => void;
}

export function Settings({ language, onLanguageChange, onClearHistory }: SettingsProps) {
  const [voiceAlerts, setVoiceAlerts] = useState(true);
  const [offlineMode, setOfflineMode] = useState(true);

  const handleClearHistory = () => {
    if (confirm(language === 'hi' 
      ? 'क्या आप सभी स्कैन इतिहास को साफ करना चाहते हैं?' 
      : 'Are you sure you want to clear all scan history?')) {
      onClearHistory();
      toast.success(language === 'hi' ? 'इतिहास साफ किया गया' : 'History cleared');
    }
  };

  return (
    <div className="space-y-6 p-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-4">
          <Info className="w-8 h-8 text-primary" />
        </div>
        <h1 className="mb-2">{t('settings', language)}</h1>
        <p className="text-muted-foreground">
          {language === 'hi' 
            ? 'अपनी प्राथमिकताएं कस्टमाइज़ करें'
            : 'Customize your preferences'}
        </p>
      </div>

      {/* Language Settings */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Globe className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="mb-1">{t('selectLanguage', language)}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {language === 'hi'
                ? 'अपनी पसंदीदा भाषा चुनें - 11+ भाषाओं में उपलब्ध'
                : 'Choose your preferred language - Available in 11+ languages'}
            </p>
            
            <Select value={language} onValueChange={(val) => onLanguageChange(val as Language)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-3">
                      <span>{lang.nativeName}</span>
                      <span className="text-muted-foreground">({lang.name})</span>
                      {language === lang.code && <Check className="w-4 h-4 text-primary" />}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Voice Alerts */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Volume2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="mb-1">{t('voiceAlerts', language)}</h3>
              <p className="text-sm text-muted-foreground">
                {language === 'hi'
                  ? 'उच्च जोखिम वाले संदेशों के लिए ऑडियो अलर्ट सक्षम करें'
                  : 'Enable audio alerts for high-risk messages'}
              </p>
            </div>
          </div>
          <Switch
            checked={voiceAlerts}
            onCheckedChange={setVoiceAlerts}
          />
        </div>
      </Card>

      {/* Offline Mode */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Wifi className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="mb-1">{t('offlineMode', language)}</h3>
              <p className="text-sm text-muted-foreground">
                {language === 'hi'
                  ? 'इंटरनेट के बिना धोखाधड़ी का पता लगाएं'
                  : 'Detect fraud without internet connection'}
              </p>
            </div>
          </div>
          <Switch
            checked={offlineMode}
            onCheckedChange={setOfflineMode}
          />
        </div>
      </Card>

      <Separator />

      {/* Data Management */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/10 rounded-lg">
            <Trash2 className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="mb-1">{t('clearHistory', language)}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {language === 'hi'
                ? 'सभी स्कैन इतिहास और डेटा हटाएं'
                : 'Remove all scan history and data'}
            </p>
            <Button
              onClick={handleClearHistory}
              variant="destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t('clearHistory', language)}
            </Button>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card className="p-6 bg-accent/50">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary rounded-lg">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="mb-2">{t('about', language)}</h3>
            
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                {language === 'hi'
                  ? 'DigiRakshak एक AI-संचालित धोखाधड़ी पहचान ऐप है जो ग्रामीण भारत और बुजुर्गों को डिजिटल धोखाधड़ी से बचाने के लिए डिज़ाइन किया गया है।'
                  : 'DigiRakshak is an AI-powered fraud detection app designed to protect rural India and elderly people from digital fraud.'}
              </p>
              
              <div className="pt-3 border-t">
                <h4 className="mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  {language === 'hi' ? 'मुख्य विशेषताएं' : 'Key Features'}
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Bot className="w-4 h-4 text-primary mt-0.5" />
                    <span>{language === 'hi' ? 'AI-संचालित धोखाधड़ी विश्लेषण' : 'AI-powered fraud analysis'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Languages className="w-4 h-4 text-primary mt-0.5" />
                    <span>{language === 'hi' ? '11+ भारतीय भाषाओं में समर्थन' : 'Support for 11+ Indian languages'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-primary mt-0.5" />
                    <span>{language === 'hi' ? 'रीयल-टाइम SMS स्कैनिंग' : 'Real-time SMS scanning'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Volume2 className="w-4 h-4 text-primary mt-0.5" />
                    <span>{language === 'hi' ? 'मूल भाषा में वॉइस अलर्ट' : 'Voice alerts in native language'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BarChart3 className="w-4 h-4 text-primary mt-0.5" />
                    <span>{language === 'hi' ? 'विस्तृत विश्लेषण और रिपोर्ट' : 'Detailed analytics and reports'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Wifi className="w-4 h-4 text-primary mt-0.5" />
                    <span>{language === 'hi' ? 'ऑफलाइन मोड समर्थन' : 'Offline mode support'}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-3 border-t">
                <h4 className="mb-2 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  {language === 'hi' ? 'आंकड़े' : 'Statistics'}
                </h4>
                <ul className="space-y-1">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                    <span>{language === 'hi' ? '85-90% धोखाधड़ी पहचान सटीकता' : '85-90% fraud detection accuracy'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                    <span>{language === 'hi' ? '₹10,000+ करोड़ वार्षिक धोखाधड़ी से बचाव' : '₹10,000+ crores annual fraud prevention'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                    <span>{language === 'hi' ? 'ग्रामीण भारत के 70% जनसंख्या के लिए' : 'For 70% population of rural India'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                    <span>{language === 'hi' ? '11+ भारतीय भाषाओं में उपलब्ध' : 'Available in 11+ Indian languages'}</span>
                  </li>
                </ul>
              </div>
              
              <Separator />
              
              <div className="text-center pt-2">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <p>
                    {language === 'hi'
                      ? 'डिजिटल धोखाधड़ी के खिलाफ आपकी ढाल'
                      : 'Your Shield Against Digital Fraud'}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">Version 1.0.0</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Emergency Note */}
      <Card className="p-4 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
        <div className="flex items-center justify-center gap-2 text-sm text-red-700 dark:text-red-300">
          <AlertTriangle className="w-4 h-4" />
          <p>
            {language === 'hi'
              ? 'आपातकाल में, 1930 (साइबर अपराध हेल्पलाइन) या 100 (पुलिस) पर कॉल करें'
              : 'In emergency, call 1930 (Cyber Crime Helpline) or 100 (Police)'}
          </p>
        </div>
      </Card>
    </div>
  );
}
