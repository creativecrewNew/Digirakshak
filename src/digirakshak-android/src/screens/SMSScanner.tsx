import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { analyzeSMS } from '../utils/fraudDetection';
import { Language, SMSMessage } from '../types';

interface Props {
  language: Language;
  isDark: boolean;
}

const SMSScanner: React.FC<Props> = ({ language, isDark }) => {
  const [sender, setSender] = useState('');
  const [content, setContent] = useState('');
  const [result, setResult] = useState<SMSMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    checkSMSPermission();
  }, []);

  // REQUEST SMS PERMISSION - THIS IS THE KEY!
  const checkSMSPermission = async () => {
    if (Platform.OS !== 'android') {
      return;
    }

    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_SMS
      );
      setHasPermission(granted);
    } catch (error) {
      console.log('Error checking permission:', error);
    }
  };

  const requestSMSPermission = async () => {
    if (Platform.OS !== 'android') {
      Alert.alert(
        'Not Available',
        'SMS reading is only available on Android devices.'
      );
      return false;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'DigiRakshak SMS Permission',
          message: 'DigiRakshak needs access to read your SMS to scan for fraud',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setHasPermission(true);
        return true;
      } else {
        Alert.alert(
          language === 'hi' ? 'अनुमति अस्वीकृत' : 'Permission Denied',
          language === 'hi'
            ? 'SMS पढ़ने के लिए अनुमति चाहिए'
            : 'SMS permission is required to read messages'
        );
        return false;
      }
    } catch (error) {
      console.log('Error requesting permission:', error);
      return false;
    }
  };

  // READ LAST SMS FROM PHONE - THIS IS WHAT YOU WANTED!
  const readLastSMS = async () => {
    if (!hasPermission) {
      const granted = await requestSMSPermission();
      if (!granted) return;
    }

    setIsLoading(true);

    try {
      const filter = {
        box: 'inbox', // 'inbox', 'sent', 'draft', 'outbox', 'failed', 'queued'
        maxCount: 1, // GET LAST MESSAGE ONLY!
      };

      SmsAndroid.list(
        JSON.stringify(filter),
        (fail: string) => {
          console.log('Failed to read SMS:', fail);
          Alert.alert(
            language === 'hi' ? 'त्रुटि' : 'Error',
            language === 'hi'
              ? 'SMS पढ़ने में विफल'
              : 'Failed to read SMS messages'
          );
          setIsLoading(false);
        },
        (count: number, smsList: string) => {
          console.log('SMS count:', count);
          
          if (count > 0) {
            const messages = JSON.parse(smsList);
            const lastSMS = messages[0];
            
            console.log('Last SMS:', lastSMS);
            
            // Set sender and content
            setSender(lastSMS.address || 'Unknown');
            setContent(lastSMS.body || '');
            
            Alert.alert(
              language === 'hi' ? 'सफलता!' : 'Success!',
              language === 'hi'
                ? 'आखिरी SMS पढ़ा गया। अब "विश्लेषण करें" दबाएं।'
                : 'Last SMS read. Now tap "Analyze".',
              [{ text: 'OK', onPress: () => analyzeSMSNow() }]
            );
          } else {
            Alert.alert(
              language === 'hi' ? 'कोई SMS नहीं' : 'No SMS',
              language === 'hi'
                ? 'कोई SMS नहीं मिला'
                : 'No SMS messages found'
            );
          }
          
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.log('Error reading SMS:', error);
      Alert.alert(
        language === 'hi' ? 'त्रुटि' : 'Error',
        language === 'hi' ? 'SMS पढ़ने में त्रुटि' : 'Error reading SMS'
      );
      setIsLoading(false);
    }
  };

  const analyzeSMSNow = () => {
    if (!content.trim()) {
      Alert.alert(
        language === 'hi' ? 'खाली संदेश' : 'Empty Message',
        language === 'hi'
          ? 'कृपया SMS सामग्री दर्ज करें'
          : 'Please enter SMS content'
      );
      return;
    }

    setIsLoading(true);
    
    // Simulate processing delay for better UX
    setTimeout(() => {
      const analysisResult = analyzeSMS(sender, content);
      setResult(analysisResult);
      setIsLoading(false);
    }, 1000);
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return '#EF4444'; // Red - Critical
    if (score >= 60) return '#F97316'; // Orange - High
    if (score >= 40) return '#EAB308'; // Yellow - Medium
    if (score >= 20) return '#84CC16'; // Light green - Low
    return '#22C55E'; // Green - Safe
  };

  const getRiskLabel = (score: number) => {
    const labels = {
      en: {
        critical: 'CRITICAL DANGER',
        high: 'HIGH RISK',
        medium: 'SUSPICIOUS',
        low: 'BE CAREFUL',
        safe: 'SAFE',
      },
      hi: {
        critical: 'गंभीर खतरा',
        high: 'उच्च जोखिम',
        medium: 'संदिग्ध',
        low: 'सावधान रहें',
        safe: 'सुरक्षित',
      },
    };

    const lang = language === 'hi' ? 'hi' : 'en';
    if (score >= 80) return labels[lang].critical;
    if (score >= 60) return labels[lang].high;
    if (score >= 40) return labels[lang].medium;
    if (score >= 20) return labels[lang].low;
    return labels[lang].safe;
  };

  const colors = {
    bg: isDark ? '#0f172a' : '#ffffff',
    text: isDark ? '#f1f5f9' : '#0f172a',
    card: isDark ? '#1e293b' : '#f8fafc',
    border: isDark ? '#334155' : '#e2e8f0',
    primary: '#06B6D4',
    secondary: '#EAB308',
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Icon name="shield-search" size={40} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>
          {language === 'hi' ? 'SMS स्कैनर' : 'SMS Scanner'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.text + '99' }]}>
          {language === 'hi'
            ? 'धोखाधड़ी का पता लगाएं'
            : 'Detect Fraud Messages'}
        </Text>
      </View>

      {/* READ LAST SMS BUTTON - THE MAIN FEATURE! */}
      <TouchableOpacity
        style={[styles.readButton, { backgroundColor: colors.primary }]}
        onPress={readLastSMS}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <>
            <Icon name="message-text" size={24} color="#ffffff" />
            <Text style={styles.readButtonText}>
              {language === 'hi' ? '📱 फोन से आखिरी SMS पढ़ें' : '📱 Read Last SMS from Phone'}
            </Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={[styles.orText, { color: colors.text + '66' }]}>
        {language === 'hi' ? 'या मैन्युअल रूप से दर्ज करें' : 'OR Enter Manually'}
      </Text>

      {/* Sender Input */}
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>
          {language === 'hi' ? 'भेजने वाला (वैकल्पिक)' : 'Sender (Optional)'}
        </Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
          ]}
          placeholder={language === 'hi' ? 'जैसे: HDFCBK, +919876543210' : 'e.g., HDFCBK, +919876543210'}
          placeholderTextColor={colors.text + '66'}
          value={sender}
          onChangeText={setSender}
        />
      </View>

      {/* Message Content */}
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>
          {language === 'hi' ? 'संदेश सामग्री' : 'Message Content'}
        </Text>
        <TextInput
          style={[
            styles.textArea,
            { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
          ]}
          placeholder={language === 'hi' ? 'SMS संदेश यहाँ पेस्ट करें...' : 'Paste SMS message here...'}
          placeholderTextColor={colors.text + '66'}
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={6}
        />
      </View>

      {/* Analyze Button */}
      <TouchableOpacity
        style={[styles.analyzeButton, { backgroundColor: colors.secondary }]}
        onPress={analyzeSMSNow}
        disabled={isLoading || !content.trim()}
      >
        <Icon name="magnify-scan" size={24} color="#000000" />
        <Text style={styles.analyzeButtonText}>
          {isLoading
            ? language === 'hi'
              ? 'विश्लेषण हो रहा है...'
              : 'Analyzing...'
            : language === 'hi'
            ? 'विश्लेषण करें'
            : 'Analyze'}
        </Text>
      </TouchableOpacity>

      {/* Results */}
      {result && (
        <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.scoreContainer}>
            <View style={[styles.scoreBadge, { backgroundColor: getRiskColor(result.fraudScore) }]}>
              <Text style={styles.scoreText}>{result.fraudScore}%</Text>
            </View>
            <Text style={[styles.riskLabel, { color: getRiskColor(result.fraudScore) }]}>
              {getRiskLabel(result.fraudScore)}
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${result.fraudScore}%`,
                  backgroundColor: getRiskColor(result.fraudScore),
                },
              ]}
            />
          </View>

          {/* Reasons */}
          {result.reasons.length > 0 && (
            <View style={styles.reasonsContainer}>
              <Text style={[styles.reasonsTitle, { color: colors.text }]}>
                {language === 'hi' ? '🚨 चेतावनी के संकेत:' : '🚨 Warning Signs:'}
              </Text>
              {result.reasons.map((reason, index) => (
                <View key={index} style={styles.reasonItem}>
                  <Icon name="alert-circle" size={16} color={getRiskColor(result.fraudScore)} />
                  <Text style={[styles.reasonText, { color: colors.text }]}>
                    {reason}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Safety Tip */}
          <View style={[styles.tipBox, { backgroundColor: isDark ? '#334155' : '#FEF3C7' }]}>
            <Icon name="lightbulb" size={20} color={colors.secondary} />
            <Text style={[styles.tipText, { color: colors.text }]}>
              {result.fraudScore >= 60
                ? language === 'hi'
                  ? '⚠️ इस संदेश पर भरोसा न करें। किसी भी लिंक पर क्लिक न करें या जानकारी साझा न करें।'
                  : '⚠️ Do NOT trust this message. Do not click links or share information.'
                : language === 'hi'
                ? '✅ यह संदेश सुरक्षित लगता है, लेकिन हमेशा सावधान रहें।'
                : '✅ This message appears safe, but always stay cautious.'}
            </Text>
          </View>
        </View>
      )}
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
    marginBottom: 24,
    marginTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  readButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  readButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  analyzeButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  riskLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
  },
  reasonsContainer: {
    marginBottom: 16,
  },
  reasonsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  reasonText: {
    fontSize: 14,
    flex: 1,
  },
  tipBox: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default SMSScanner;