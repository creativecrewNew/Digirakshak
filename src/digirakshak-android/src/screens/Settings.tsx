import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Language } from '../types';

interface Props {
  language: Language;
  isDark: boolean;
  onLanguageChange: (lang: Language) => void;
  onThemeToggle: () => void;
}

const Settings: React.FC<Props> = ({ language, isDark, onLanguageChange, onThemeToggle }) => {
  const colors = {
    bg: isDark ? '#0f172a' : '#ffffff',
    text: isDark ? '#f1f5f9' : '#0f172a',
    card: isDark ? '#1e293b' : '#f8fafc',
    border: isDark ? '#334155' : '#e2e8f0',
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Icon name="cog" size={50} color="#06B6D4" />
        <Text style={[styles.title, { color: colors.text }]}>
          {language === 'hi' ? 'सेटिंग्स' : 'Settings'}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Icon name="theme-light-dark" size={24} color={colors.text} />
            <Text style={[styles.settingText, { color: colors.text }]}>
              {language === 'hi' ? 'डार्क मोड' : 'Dark Mode'}
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={onThemeToggle}
            trackColor={{ false: '#cbd5e1', true: '#06B6D4' }}
            thumbColor={isDark ? '#ffffff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          {language === 'hi' ? '📱 ऐप के बारे में' : '📱 About App'}
        </Text>
        <Text style={[styles.cardText, { color: colors.text + '99' }]}>
          DigiRakshak v1.0.0
        </Text>
        <Text style={[styles.cardText, { color: colors.text + '99' }]}>
          {language === 'hi'
            ? 'धोखाधड़ी से सुरक्षा के लिए'
            : 'Protecting you from fraud'}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default Settings;
