import React, { useState, useEffect } from "react";
import {
  Scan,
  Bot,
  BarChart3,
  Phone,
  Settings as SettingsIcon,
  Users,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import { LanguageOnboarding } from "./components/LanguageOnboarding";
import { LaunchScreen } from "./components/LaunchScreen";
import { ThemeToggle } from "./components/ThemeToggle";
import { SMSScannerWithCamera } from "./components/SMSScannerWithCamera";
import { AIAssistant } from "./components/AIAssistant";
import { Analytics } from "./components/Analytics";
import { EmergencyContacts } from "./components/EmergencyContacts";
import { Settings } from "./components/Settings";
import { Community } from "./components/CommunityFixed";
import { Language, FraudStats, SMSMessage } from "./types";
import { t } from "./utils/translations";
import logoImage from "figma:asset/e4726761c23fe4fce5b484ce628ad7c43462d06b.png";

type View =
  | "scanner"
  | "assistant"
  | "community"
  | "analytics"
  | "emergency"
  | "settings";

export default function App() {
  const [showLaunchScreen, setShowLaunchScreen] =
    useState(true);
  const [currentView, setCurrentView] =
    useState<View>("scanner");
  const [language, setLanguage] = useState<Language | null>(
    null,
  );
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [stats, setStats] = useState<FraudStats>({
    totalScanned: 0,
    fraudDetected: 0,
    safeMessages: 0,
    lastScanDate: null,
  });
  const [recentScans, setRecentScans] = useState<SMSMessage[]>(
    [],
  );

  // Load data from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem(
      "digirakshak-language",
    );
    if (savedLanguage) {
      setLanguage(savedLanguage as Language);
    }

    const savedTheme = localStorage.getItem(
      "digirakshak-theme",
    );
    if (savedTheme) {
      setTheme(savedTheme as "light" | "dark");
      document.documentElement.classList.toggle(
        "dark",
        savedTheme === "dark",
      );
    }

    const savedStats = localStorage.getItem(
      "digirakshak-stats",
    );
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      setStats({
        ...parsed,
        lastScanDate: parsed.lastScanDate
          ? new Date(parsed.lastScanDate)
          : null,
      });
    }

    const savedScans = localStorage.getItem(
      "digirakshak-scans",
    );
    if (savedScans) {
      const parsed = JSON.parse(savedScans);
      setRecentScans(
        parsed.map((scan: any) => ({
          ...scan,
          timestamp: new Date(scan.timestamp),
        })),
      );
    }

    // Restore current view on return
    const savedView = sessionStorage.getItem(
      "digirakshak-current-view",
    );
    if (savedView) {
      setCurrentView(savedView as View);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (language) {
      localStorage.setItem("digirakshak-language", language);
    }
  }, [language]);

  useEffect(() => {
    localStorage.setItem("digirakshak-theme", theme);
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark",
    );
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(
      "digirakshak-stats",
      JSON.stringify(stats),
    );
  }, [stats]);

  useEffect(() => {
    localStorage.setItem(
      "digirakshak-scans",
      JSON.stringify(recentScans),
    );
  }, [recentScans]);

  // Persist current view for app state restoration
  useEffect(() => {
    sessionStorage.setItem(
      "digirakshak-current-view",
      currentView,
    );
  }, [currentView]);

  // Handle visibility change (when user returns from phone call, etc.)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // App has become visible again - restore state
        console.log("App restored");
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );
    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, []);

  // Register service worker for offline support
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("SW registered:", registration);
          })
          .catch((error) => {
            console.log("SW registration failed:", error);
          });
      });
    }
  }, []);

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleScan = (message: SMSMessage) => {
    setRecentScans((prev) => [message, ...prev]);
    setStats((prev) => ({
      totalScanned: prev.totalScanned + 1,
      fraudDetected:
        prev.fraudDetected + (message.isScam ? 1 : 0),
      safeMessages:
        prev.safeMessages + (message.isScam ? 0 : 1),
      lastScanDate: new Date(),
    }));
  };

  const handleClearHistory = () => {
    setRecentScans([]);
    setStats({
      totalScanned: 0,
      fraudDetected: 0,
      safeMessages: 0,
      lastScanDate: null,
    });
  };

  // Show launch screen
  if (showLaunchScreen) {
    return (
      <LaunchScreen
        onComplete={() => setShowLaunchScreen(false)}
      />
    );
  }

  // Show language onboarding if no language selected
  if (!language) {
    return (
      <LanguageOnboarding
        onLanguageSelect={handleLanguageSelect}
      />
    );
  }

  const navigationItems = [
    {
      id: "scanner" as View,
      icon: Scan,
      label: t("scanner", language),
    },
    {
      id: "assistant" as View,
      icon: Bot,
      label: t("assistant", language),
    },
    {
      id: "community" as View,
      icon: Users,
      label: language === "hi" ? "समुदाय" : "Community",
    },
    {
      id: "analytics" as View,
      icon: BarChart3,
      label: t("analytics", language),
    },
    {
      id: "emergency" as View,
      icon: Phone,
      label: t("emergency", language),
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-card via-yellow-50 to-card dark:from-card dark:via-yellow-950/10 dark:to-card backdrop-blur-sm border-b shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src={logoImage}
                alt="DigiRakshak"
                className="w-12 h-12 rounded-lg"
              />
              <div>
                <h1 className="text-lg">
                  Digi{t("rakshak", language)}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {t("tagline", language)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Language Dropdown */}
              <select
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value as Language)
                }
                className="px-3 py-2 text-sm border border-yellow-300 dark:border-yellow-700 rounded-lg bg-background hover:bg-accent cursor-pointer transition-colors"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="pa">ਪੰਜਾਬੀ</option>
                <option value="ta">தமிழ்</option>
                <option value="te">తెలుగు</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="ml">മലയാളം</option>
                <option value="bn">বাংলা</option>
                <option value="gu">ગુજરાતી</option>
                <option value="bho">भोजपुरी</option>
                <option value="hne">हरियाणवी</option>
              </select>

              <ThemeToggle
                theme={theme}
                onToggle={toggleTheme}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentView("settings")}
              >
                <SettingsIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20">
        {currentView === "scanner" && (
          <SMSScannerWithCamera language={language} onScan={handleScan} />
        )}

        {currentView === "assistant" && (
          <div className="h-[calc(100vh-160px)] overflow-hidden">
            <AIAssistant language={language} />
          </div>
        )}

        {currentView === "community" && (
          <div className="h-[calc(100vh-160px)] overflow-hidden">
            <Community language={language} />
          </div>
        )}

        {currentView === "analytics" && (
          <Analytics
            language={language}
            stats={stats}
            recentScans={recentScans}
          />
        )}

        {currentView === "emergency" && (
          <EmergencyContacts language={language} />
        )}

        {currentView === "settings" && (
          <Settings
            language={language}
            onLanguageChange={setLanguage}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-lg">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`flex flex-col h-auto py-2 px-2 ${isActive ? "" : "text-muted-foreground"}`}
                onClick={() => setCurrentView(item.id)}
              >
                <Icon
                  className={`w-5 h-5 mb-1 ${isActive ? "" : "opacity-70"}`}
                />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}