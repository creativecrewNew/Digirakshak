import React, { useState } from 'react';
import { Globe, ChevronRight } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Language, LanguageOption } from '../types';
import { languages } from '../utils/translations';
import logoImage from 'figma:asset/e4726761c23fe4fce5b484ce628ad7c43462d06b.png';

interface LanguageOnboardingProps {
  onLanguageSelect: (lang: Language) => void;
}

export function LanguageOnboarding({ onLanguageSelect }: LanguageOnboardingProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);

  const handleContinue = () => {
    if (selectedLanguage) {
      onLanguageSelect(selectedLanguage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-yellow-50/30 to-background dark:from-background dark:via-yellow-950/10 dark:to-background">
      <div className="w-full max-w-2xl">
        {/* App Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex p-2 bg-white dark:bg-card rounded-2xl mb-4 shadow-lg">
            <img src={logoImage} alt="DigiRakshak" className="w-20 h-20 rounded-xl" />
          </div>
          <h1 className="text-4xl mb-3 text-foreground">DigiRakshak</h1>
          <p className="text-muted-foreground text-lg mb-2">
            AI-Powered Fraud Detection
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Protecting India from digital fraud with multilingual support
          </p>
        </div>

        {/* Language Selection Card */}
        <Card className="p-8 shadow-xl border-2 border-yellow-200 dark:border-yellow-900/30 bg-gradient-to-br from-card to-yellow-50/30 dark:to-yellow-950/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-primary/10 to-yellow-500/10 rounded-lg">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl text-foreground">Select Your Language</h2>
              <p className="text-sm text-muted-foreground">भाषा चुनें | ਭਾਸ਼ਾ ਚੁਣੋ | మీ భాషను ఎంచుకోండి</p>
            </div>
          </div>

          {/* Language Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`p-4 rounded-lg border-2 text-left transition-all hover:scale-[1.02] ${
                  selectedLanguage === lang.code
                    ? 'border-primary bg-gradient-to-br from-primary/10 to-yellow-500/10 shadow-md'
                    : 'border-yellow-200 dark:border-yellow-900/30 hover:border-primary/50 bg-card'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg text-foreground">{lang.nativeName}</div>
                    <div className="text-sm text-muted-foreground">{lang.name}</div>
                  </div>
                  {selectedLanguage === lang.code && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            disabled={!selectedLanguage}
            className="w-full py-6 text-lg"
            size="lg"
          >
            Continue
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>

          {/* Info */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              11+ Indian languages supported | Voice alerts in your language
            </p>
          </div>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl mb-1 text-foreground">85%+</div>
            <div className="text-xs text-muted-foreground">Detection Accuracy</div>
          </div>
          <div className="p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl mb-1 text-foreground">11+</div>
            <div className="text-xs text-muted-foreground">Languages</div>
          </div>
          <div className="p-4 bg-card/50 rounded-lg border">
            <div className="text-2xl mb-1 text-foreground">24/7</div>
            <div className="text-xs text-muted-foreground">Protection</div>
          </div>
        </div>
      </div>
    </div>
  );
}