import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Language } from '../types';

interface Props {
  language: Language;
  isDark: boolean;
}

const Emergency: React.FC<Props> = ({ language, isDark }) => {
  const colors = {
    bg: isDark ? '#0f172a' : '#ffffff',
    text: isDark ? '#f1f5f9' : '#0f172a',
    card: isDark ? '#1e293b' : '#f8fafc',
    border: isDark ? '#334155' : '#e2e8f0',
  };

  const callNumber = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Icon name="phone-alert" size={50} color="#EF4444" />
        <Text style={[styles.title, { color: colors.text }]}>
          {language === 'hi' ? 'आपातकालीन संपर्क' : 'Emergency Contacts'}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.emergencyButton, { backgroundColor: '#EF4444' }]}
        onPress={() => callNumber('1930')}
      >
        <Icon name="shield-alert" size={32} color="#ffffff" />
        <View style={styles.buttonTextContainer}>
          <Text style={styles.buttonTitle}>
            {language === 'hi' ? 'साइबर अपराध हेल्पलाइन' : 'Cyber Crime Helpline'}
          </Text>
          <Text style={styles.buttonNumber}>1930</Text>
          <Text style={styles.buttonSubtitle}>24/7 Available</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.emergencyButton, { backgroundColor: '#F97316' }]}
        onPress={() => callNumber('100')}
      >
        <Icon name="police-badge" size={32} color="#ffffff" />
        <View style={styles.buttonTextContainer}>
          <Text style={styles.buttonTitle}>
            {language === 'hi' ? 'पुलिस आपातकाल' : 'Police Emergency'}
          </Text>
          <Text style={styles.buttonNumber}>100</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.emergencyButton, { backgroundColor: '#EAB308' }]}
        onPress={() => callNumber('181')}
      >
        <Icon name="account-alert" size={32} color="#ffffff" />
        <View style={styles.buttonTextContainer}>
          <Text style={styles.buttonTitle}>
            {language === 'hi' ? 'महिला हेल्पलाइन' : 'Women Helpline'}
          </Text>
          <Text style={styles.buttonNumber}>181</Text>
        </View>
      </TouchableOpacity>

      <View style={[styles.tipsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.tipsTitle, { color: colors.text }]}>
          {language === 'hi' ? '⚠️ यदि धोखाधड़ी हो गई है' : '⚠️ If You\'ve Been Scammed'}
        </Text>
        <Text style={[styles.tipText, { color: colors.text }]}>
          1. {language === 'hi' ? 'तुरंत 1930 पर कॉल करें' : 'Call 1930 immediately'}
        </Text>
        <Text style={[styles.tipText, { color: colors.text }]}>
          2. {language === 'hi' ? 'अपने बैंक को सूचित करें' : 'Inform your bank'}
        </Text>
        <Text style={[styles.tipText, { color: colors.text }]}>
          3. {language === 'hi' ? 'सभी स्क्रीनशॉट सहेजें' : 'Save all screenshots'}
        </Text>
        <Text style={[styles.tipText, { color: colors.text }]}>
          4. {language === 'hi' ? 'OTP या PIN साझा न करें' : 'Never share OTP or PIN'}
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
    marginVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  buttonNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 4,
  },
  buttonSubtitle: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
  },
  tipsCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
});

export default Emergency;
