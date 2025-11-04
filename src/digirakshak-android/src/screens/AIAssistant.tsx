import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Language } from '../types';

interface Props {
  language: Language;
  isDark: boolean;
}

const AIAssistant: React.FC<Props> = ({ language, isDark }) => {
  const colors = {
    bg: isDark ? '#0f172a' : '#ffffff',
    text: isDark ? '#f1f5f9' : '#0f172a',
    card: isDark ? '#1e293b' : '#f8fafc',
    border: isDark ? '#334155' : '#e2e8f0',
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Icon name="robot" size={50} color="#06B6D4" />
        <Text style={[styles.title, { color: colors.text }]}>
          {language === 'hi' ? 'AI सहायक' : 'AI Assistant'}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardText, { color: colors.text }]}>
          {language === 'hi'
            ? '🤖 AI सहायक जल्द आ रहा है!'
            : '🤖 AI Assistant coming soon!'}
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
  cardText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});

export default AIAssistant;
