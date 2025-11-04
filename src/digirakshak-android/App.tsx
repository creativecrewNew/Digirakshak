import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import LanguageOnboarding from './src/screens/LanguageOnboarding';
import Dashboard from './src/screens/Dashboard';
import SMSScannerWithCamera from './src/screens/SMSScannerWithCamera';
import Community from './src/screens/Community';
import Emergency from './src/screens/Emergency';
import AIAssistant from './src/screens/AIAssistant';
import Analytics from './src/screens/Analytics';
import Settings from './src/screens/Settings';
import LaunchScreen from './src/screens/LaunchScreen';

// Types
import { Language } from './src/types';

const Tab = createBottomTabNavigator();

const App = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);
  const [showLaunch, setShowLaunch] = useState(true);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadLanguage();
    // Hide launch screen after 2.5 seconds
    setTimeout(() => setShowLaunch(false), 2500);
  }, []);

  const loadLanguage = async () => {
    try {
      const saved = await AsyncStorage.getItem('selectedLanguage');
      if (saved) {
        setLanguage(saved as Language);
        setHasSelectedLanguage(true);
      }
    } catch (error) {
      console.log('Error loading language:', error);
    }
  };

  const handleLanguageSelect = async (lang: Language) => {
    setLanguage(lang);
    setHasSelectedLanguage(true);
    try {
      await AsyncStorage.setItem('selectedLanguage', lang);
    } catch (error) {
      console.log('Error saving language:', error);
    }
  };

  if (showLaunch) {
    return <LaunchScreen />;
  }

  if (!hasSelectedLanguage) {
    return <LanguageOnboarding onLanguageSelect={handleLanguageSelect} />;
  }

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#0a0f1a' : '#ffffff'}
      />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#06B6D4',
            tabBarInactiveTintColor: '#94A3B8',
            tabBarStyle: {
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              borderTopColor: isDark ? '#334155' : '#e2e8f0',
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
            headerStyle: {
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
            },
            headerTintColor: isDark ? '#f1f5f9' : '#0f172a',
          }}
        >
          <Tab.Screen
            name="Dashboard"
            options={{
              tabBarLabel: language === 'hi' ? 'होम' : 'Home',
              tabBarIcon: ({ color, size }) => (
                <Icon name="home" size={size} color={color} />
              ),
              headerShown: false,
            }}
          >
            {() => <Dashboard language={language} isDark={isDark} />}
          </Tab.Screen>

          <Tab.Screen
            name="SMS Scanner"
            options={{
              tabBarLabel: language === 'hi' ? 'स्कैन' : 'Scan',
              tabBarIcon: ({ color, size }) => (
                <Icon name="shield-search" size={size} color={color} />
              ),
              headerShown: false,
            }}
          >
            {() => <SMSScannerWithCamera language={language} isDark={isDark} />}
          </Tab.Screen>

          <Tab.Screen
            name="Community"
            options={{
              tabBarLabel: language === 'hi' ? 'समुदाय' : 'Community',
              tabBarIcon: ({ color, size }) => (
                <Icon name="account-group" size={size} color={color} />
              ),
              headerShown: false,
            }}
          >
            {() => <Community language={language} isDark={isDark} />}
          </Tab.Screen>

          <Tab.Screen
            name="Emergency"
            options={{
              tabBarLabel: language === 'hi' ? 'आपातकाल' : 'Emergency',
              tabBarIcon: ({ color, size }) => (
                <Icon name="phone-alert" size={size} color={color} />
              ),
              headerShown: false,
            }}
          >
            {() => <Emergency language={language} isDark={isDark} />}
          </Tab.Screen>

          <Tab.Screen
            name="Settings"
            options={{
              tabBarLabel: language === 'hi' ? 'सेटिंग्स' : 'Settings',
              tabBarIcon: ({ color, size }) => (
                <Icon name="cog" size={size} color={color} />
              ),
              headerShown: false,
            }}
          >
            {() => (
              <Settings
                language={language}
                isDark={isDark}
                onLanguageChange={handleLanguageSelect}
                onThemeToggle={() => setIsDark(!isDark)}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;