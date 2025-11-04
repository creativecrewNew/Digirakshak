import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Language } from '../types';

interface Props {
  language: Language;
  isDark: boolean;
}

const Dashboard: React.FC<Props> = ({ language, isDark }) => {
  const colors = {
    bg: isDark ? '#0f172a' : '#ffffff',
    text: isDark ? '#f1f5f9' : '#0f172a',
    card: isDark ? '#1e293b' : '#f8fafc',
    border: isDark ? '#334155' : '#e2e8f0',
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Icon name="shield-check" size={60} color="#06B6D4" />
        <Text style={[styles.title, { color: colors.text }]}>
          {language === 'hi' ? 'DigiRakshak' : 'DigiRakshak'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.text + '99' }]}>
          {language === 'hi' ? 'आपका अपना सुरक्षा कवच' : 'Your Digital Security Shield'}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          {language === 'hi' ? '🛡️ स्वागत है!' : '🛡️ Welcome!'}
        </Text>
        <Text style={[styles.cardText, { color: colors.text + '99' }]}>
          {language === 'hi'
            ? 'DigiRakshak धोखाधड़ी वाले SMS से आपकी रक्षा करता है। अपने संदेशों को स्कैन करने के लिए "स्कैन" टैब पर जाएं।'
            : 'DigiRakshak protects you from fraud SMS. Go to "Scan" tab to analyze your messages.'}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          {language === 'hi' ? '📱 SMS स्कैनर' : '📱 SMS Scanner'}
        </Text>
        <Text style={[styles.cardText, { color: colors.text + '99' }]}>
          {language === 'hi'
            ? 'अपने फोन से सीधे आखिरी SMS पढ़ें और धोखाधड़ी का पता लगाएं।'
            : 'Read last SMS directly from your phone and detect fraud.'}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          {language === 'hi' ? '🚨 आपातकालीन संपर्क' : '🚨 Emergency Contacts'}
        </Text>
        <Text style={[styles.cardText, { color: colors.text + '99' }]}>
          Cyber Crime Helpline: 1930 (24/7)
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
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default Dashboard;
