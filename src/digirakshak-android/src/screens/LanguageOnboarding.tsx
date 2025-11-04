import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Language } from '../types';

interface Props {
  onLanguageSelect: (language: Language) => void;
}

const languages = [
  { code: 'en' as Language, name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi' as Language, name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
  { code: 'pa' as Language, name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'ta' as Language, name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te' as Language, name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn' as Language, name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml' as Language, name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
  { code: 'bn' as Language, name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
  { code: 'gu' as Language, name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'bho' as Language, name: 'Bhojpuri', native: 'भोजपुरी', flag: '🇮🇳' },
  { code: 'hne' as Language, name: 'Haryanvi', native: 'हरियाणवी', flag: '🇮🇳' },
];

const LanguageOnboarding: React.FC<Props> = ({ onLanguageSelect }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="shield-check" size={80} color="#06B6D4" />
        <Text style={styles.title}>DigiRakshak</Text>
        <Text style={styles.subtitle}>Select Your Language</Text>
        <Text style={styles.subtitleNative}>अपनी भाषा चुनें</Text>
      </View>

      <View style={styles.languageGrid}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={styles.languageCard}
            onPress={() => onLanguageSelect(lang.code)}
          >
            <Text style={styles.flag}>{lang.flag}</Text>
            <Text style={styles.languageName}>{lang.native}</Text>
            <Text style={styles.languageEnglish}>{lang.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#94a3b8',
    marginTop: 8,
  },
  subtitleNative: {
    fontSize: 16,
    color: '#EAB308',
    marginTop: 4,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  languageCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#334155',
  },
  flag: {
    fontSize: 40,
    marginBottom: 8,
  },
  languageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  languageEnglish: {
    fontSize: 14,
    color: '#94a3b8',
  },
});

export default LanguageOnboarding;
