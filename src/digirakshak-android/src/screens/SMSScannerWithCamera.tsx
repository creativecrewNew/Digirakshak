import React, { useState, useEffect, useRef } from 'react';
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
  Image,
  Modal,
} from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import TextRecognition from 'react-native-text-recognition';
import { analyzeSMS } from '../utils/fraudDetection';
import { Language, SMSMessage } from '../types';

interface Props {
  language: Language;
  isDark: boolean;
}

const SMSScannerWithCamera: React.FC<Props> = ({ language, isDark }) => {
  const [sender, setSender] = useState('');
  const [content, setContent] = useState('');
  const [result, setResult] = useState<SMSMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    checkSMSPermission();
  }, []);

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

  const requestCameraPermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'DigiRakshak Camera Permission',
          message: 'DigiRakshak needs camera access to capture SMS photos',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.log('Camera permission error:', error);
      return false;
    }
  };

  const readLastSMS = async () => {
    if (!hasPermission) {
      const granted = await requestSMSPermission();
      if (!granted) return;
    }

    setIsLoading(true);

    try {
      const filter = {
        box: 'inbox',
        maxCount: 1,
      };

      SmsAndroid.list(
        JSON.stringify(filter),
        (fail) => {
          console.log('Failed to read SMS:', fail);
          Alert.alert(
            language === 'hi' ? 'त्रुटि' : 'Error',
            language === 'hi'
              ? 'SMS पढ़ने में विफल'
              : 'Failed to read SMS'
          );
          setIsLoading(false);
        },
        (count, smsList) => {
          console.log('SMS Count:', count);
          const smsArray = JSON.parse(smsList);

          if (smsArray.length > 0) {
            const lastSMS = smsArray[0];
            setSender(lastSMS.address || '');
            setContent(lastSMS.body || '');

            Alert.alert(
              '✅ ' + (language === 'hi' ? 'सफल' : 'Success'),
              language === 'hi'
                ? 'आखिरी SMS लोड किया गया'
                : 'Last SMS loaded successfully'
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
      console.log('Read SMS error:', error);
      setIsLoading(false);
    }
  };

  const takePhoto = async () => {
    const hasCamera = await requestCameraPermission();
    if (!hasCamera) {
      Alert.alert(
        language === 'hi' ? 'अनुमति अस्वीकृत' : 'Permission Denied',
        language === 'hi'
          ? 'कैमरा एक्सेस की अनुमति चाहिए'
          : 'Camera access permission is required'
      );
      return;
    }

    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: false,
    });

    if (result.assets && result.assets[0]) {
      setCapturedImage(result.assets[0].uri || null);
    }
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets[0]) {
      setCapturedImage(result.assets[0].uri || null);
    }
  };

  const extractTextFromImage = async (imageUri: string) => {
    setIsProcessingImage(true);

    try {
      Alert.alert(
        language === 'hi' ? 'प्रोसेसिंग...' : 'Processing...',
        language === 'hi'
          ? 'छवि से टेक्स्ट निकाला जा रहा है...'
          : 'Extracting text from image...'
      );

      const recognizedText = await TextRecognition.recognize(imageUri);

      if (recognizedText && recognizedText.length > 0) {
        const extractedText = recognizedText.join(' ').trim();
        setContent(extractedText);
        setCapturedImage(null);

        Alert.alert(
          '✅ ' + (language === 'hi' ? 'सफल' : 'Success'),
          language === 'hi'
            ? 'टेक्स्ट सफलतापूर्वक निकाला गया!'
            : 'Text extracted successfully!'
        );
      } else {
        Alert.alert(
          language === 'hi' ? 'त्रुटि' : 'Error',
          language === 'hi'
            ? 'छवि में कोई टेक्स्ट नहीं मिला'
            : 'No text found in image'
        );
      }
    } catch (error) {
      console.log('OCR error:', error);
      Alert.alert(
        language === 'hi' ? 'त्रुटि' : 'Error',
        language === 'hi'
          ? 'टेक्स्ट निकालने में विफल'
          : 'Failed to extract text from image'
      );
    } finally {
      setIsProcessingImage(false);
    }
  };

  const analyzeSMSNow = () => {
    if (!content.trim()) {
      Alert.alert(
        language === 'hi' ? 'त्रुटि' : 'Error',
        language === 'hi'
          ? 'कृपया संदेश दर्ज करें'
          : 'Please enter a message'
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const analysis = analyzeSMS(sender.trim() || 'Unknown', content);
      setResult(analysis);
      setIsLoading(false);

      const riskLevel = getRiskLabel(analysis.fraudScore);
      Alert.alert(
        '🛡️ ' + (language === 'hi' ? 'स्कैन पूर्ण' : 'Scan Complete'),
        `${language === 'hi' ? 'स्तर' : 'Risk'}: ${riskLevel}\n${language === 'hi' ? 'स्कोर' : 'Score'}: ${analysis.fraudScore}%`,
        [{ text: 'OK' }]
      );
    }, 1500);
  };

  const clearForm = () => {
    setSender('');
    setContent('');
    setResult(null);
    setCapturedImage(null);
  };

  const getRiskLabel = (score: number): string => {
    const labels = {
      en: {
        critical: 'Critical Danger ⚠️',
        high: 'High Risk 🚨',
        medium: 'Suspicious ⚠️',
        low: 'Be Careful ⚠️',
        safe: 'Safe ✅',
      },
      hi: {
        critical: 'गंभीर खतरा ⚠️',
        high: 'उच्च जोखिम 🚨',
        medium: 'संदिग्ध ⚠️',
        low: 'सावधान रहें ⚠️',
        safe: 'सुरक्षित ✅',
      },
    };

    const lang = language === 'hi' ? 'hi' : 'en';
    if (score >= 80) return labels[lang].critical;
    if (score >= 60) return labels[lang].high;
    if (score >= 40) return labels[lang].medium;
    if (score >= 20) return labels[lang].low;
    return labels[lang].safe;
  };

  const getRiskColor = (score: number): string => {
    if (score >= 80) return '#dc2626';
    if (score >= 60) return '#ef4444';
    if (score >= 40) return '#f97316';
    if (score >= 20) return '#eab308';
    return '#22c55e';
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

      {/* Image Capture Modal */}
      <Modal
        visible={!!capturedImage}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCapturedImage(null)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            {capturedImage && (
              <Image
                source={{ uri: capturedImage }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            )}

            {isProcessingImage ? (
              <View style={styles.processingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.processingText, { color: colors.text }]}>
                  {language === 'hi'
                    ? 'छवि से टेक्स्ट निकाल रहे हैं...'
                    : 'Extracting text from image...'}
                </Text>
              </View>
            ) : (
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.primary }]}
                  onPress={() => capturedImage && extractTextFromImage(capturedImage)}
                >
                  <Icon name="check" size={24} color="#fff" />
                  <Text style={styles.modalButtonText}>
                    {language === 'hi' ? 'उपयोग करें' : 'Use This'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.border }]}
                  onPress={() => setCapturedImage(null)}
                >
                  <Icon name="close" size={24} color={colors.text} />
                  <Text style={[styles.modalButtonText, { color: colors.text }]}>
                    {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* READ LAST SMS BUTTON */}
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
              {language === 'hi' ? '📱 फोन से आखिरी SMS पढ़ें' : '📱 Read Last SMS'}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Camera and Upload Buttons */}
      <View style={styles.imageButtonsContainer}>
        <TouchableOpacity
          style={[styles.imageButton, { backgroundColor: colors.secondary }]}
          onPress={takePhoto}
          disabled={isLoading}
        >
          <Icon name="camera" size={24} color="#ffffff" />
          <Text style={styles.imageButtonText}>
            {language === 'hi' ? 'फ़ोटो लें' : 'Take Photo'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.imageButton, { backgroundColor: colors.secondary }]}
          onPress={pickImage}
          disabled={isLoading}
        >
          <Icon name="image" size={24} color="#ffffff" />
          <Text style={styles.imageButtonText}>
            {language === 'hi' ? 'छवि अपलोड' : 'Upload Image'}
          </Text>
        </TouchableOpacity>
      </View>

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
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <>
            <Icon name="shield-search" size={24} color="#ffffff" />
            <Text style={styles.analyzeButtonText}>
              {language === 'hi' ? '🔍 विश्लेषण करें' : '🔍 Analyze SMS'}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Results */}
      {result && (
        <View
          style={[
            styles.resultCard,
            {
              backgroundColor: colors.card,
              borderColor: getRiskColor(result.fraudScore),
              borderWidth: 2,
            },
          ]}
        >
          <View style={styles.resultHeader}>
            <Icon
              name={result.fraudScore >= 60 ? 'alert-circle' : 'shield-check'}
              size={40}
              color={getRiskColor(result.fraudScore)}
            />
            <View style={styles.resultInfo}>
              <Text style={[styles.resultLabel, { color: getRiskColor(result.fraudScore) }]}>
                {getRiskLabel(result.fraudScore)}
              </Text>
              <Text style={[styles.resultScore, { color: colors.text }]}>
                {language === 'hi' ? 'स्कोर' : 'Score'}: {result.fraudScore}%
              </Text>
            </View>
          </View>

          {result.reasons && result.reasons.length > 0 && (
            <View style={styles.reasonsContainer}>
              <Text style={[styles.reasonsTitle, { color: colors.text }]}>
                {language === 'hi' ? 'कारण:' : 'Reasons:'}
              </Text>
              {result.reasons.map((reason, index) => (
                <Text key={index} style={[styles.reason, { color: colors.text }]}>
                  • {reason}
                </Text>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={[styles.clearButton, { borderColor: colors.border }]}
            onPress={clearForm}
          >
            <Icon name="refresh" size={20} color={colors.text} />
            <Text style={[styles.clearButtonText, { color: colors.text }]}>
              {language === 'hi' ? 'नया स्कैन' : 'New Scan'}
            </Text>
          </TouchableOpacity>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  readButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  readButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  imageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  imageButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 12,
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 24,
    gap: 8,
  },
  analyzeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  resultInfo: {
    flex: 1,
  },
  resultLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultScore: {
    fontSize: 16,
  },
  reasonsContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  reasonsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  reason: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
    gap: 8,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 12,
    padding: 20,
  },
  previewImage: {
    width: '100%',
    height: 400,
    borderRadius: 8,
    marginBottom: 20,
  },
  processingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  processingText: {
    marginTop: 12,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SMSScannerWithCamera;
