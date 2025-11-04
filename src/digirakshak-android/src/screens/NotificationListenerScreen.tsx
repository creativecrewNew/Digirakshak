import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  NativeModules,
  NativeEventEmitter,
  Platform,
} from 'react-native';
import { Language } from '../types';
import { analyzeSMS } from '../utils/fraudDetection';

const { NotificationListener } = NativeModules;

interface NotificationData {
  packageName: string;
  appName: string;
  type: string;
  title: string;
  content: string;
  timestamp: number;
}

interface Props {
  language: Language;
}

/**
 * DigiRakshak Real-Time Notification Listener
 * 
 * Automatically scans ALL incoming notifications for fraud:
 * ✅ SMS from Messages app
 * ✅ WhatsApp messages
 * ✅ Telegram messages
 * ✅ Email (Gmail, Outlook)
 * ✅ Banking apps (Paytm, PhonePe, GPay, Bank apps)
 * ✅ Social media notifications
 * ✅ Any app notification containing text
 */
export default function NotificationListenerScreen({ language }: Props) {
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState<NotificationData[]>([]);
  const [fraudStats, setFraudStats] = useState({
    total: 0,
    safe: 0,
    suspicious: 0,
    dangerous: 0,
  });

  useEffect(() => {
    checkPermission();
  }, []);

  useEffect(() => {
    if (!isListening) return;

    const eventEmitter = new NativeEventEmitter(NotificationListener);
    const subscription = eventEmitter.addListener(
      'onNotificationReceived',
      handleNotificationReceived
    );

    return () => {
      subscription.remove();
    };
  }, [isListening]);

  const checkPermission = async () => {
    try {
      if (Platform.OS !== 'android' || !NotificationListener) {
        return;
      }

      const granted = await NotificationListener.isNotificationAccessGranted();
      setHasPermission(granted);
    } catch (error) {
      console.error('Error checking permission:', error);
    }
  };

  const requestPermission = async () => {
    try {
      await NotificationListener.openNotificationSettings();
      
      Alert.alert(
        language === 'hi' ? '📱 अनुमति दें' : '📱 Grant Permission',
        language === 'hi'
          ? '1️⃣ "DigiRakshak" खोजें\n2️⃣ टॉगल चालू करें ✅\n3️⃣ "अनुमति दें" पर क्लिक करें\n4️⃣ ऐप पर वापस आएं'
          : '1️⃣ Find "DigiRakshak"\n2️⃣ Turn ON the toggle ✅\n3️⃣ Click "Allow"\n4️⃣ Return to app',
        [
          {
            text: language === 'hi' ? 'समझ गया' : 'Got it',
            onPress: () => {
              setTimeout(checkPermission, 1000);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error opening settings:', error);
      Alert.alert(
        language === 'hi' ? 'त्रुटि' : 'Error',
        language === 'hi' ? 'सेटिंग्स खोलने में त्रुटि' : 'Error opening settings'
      );
    }
  };

  const startListening = async () => {
    try {
      if (!hasPermission) {
        requestPermission();
        return;
      }

      await NotificationListener.startListening();
      setIsListening(true);

      Alert.alert(
        language === 'hi' ? '🔔 निगरानी चालू!' : '🔔 Monitoring Active!',
        language === 'hi'
          ? '✅ अब सभी सूचनाएं स्वचालित रूप से स्कैन होंगी!\n\n📱 SMS\n📧 Email\n💬 WhatsApp\n🏦 Banking\n\nधोखाधड़ी का पता चलने पर आपको सूचित किया जाएगा।'
          : '✅ All notifications will now be scanned automatically!\n\n📱 SMS\n📧 Email\n💬 WhatsApp\n🏦 Banking\n\nYou\'ll be alerted if fraud is detected.'
      );
    } catch (error: any) {
      console.error('Error starting listener:', error);
      Alert.alert(
        language === 'hi' ? 'त्रुटि' : 'Error',
        error.message || (language === 'hi' ? 'निगरानी शुरू नहीं हो सकी' : 'Could not start monitoring')
      );
    }
  };

  const stopListening = async () => {
    try {
      await NotificationListener.stopListening();
      setIsListening(false);

      Alert.alert(
        language === 'hi' ? '🔕 निगरानी बंद' : '🔕 Monitoring Stopped',
        language === 'hi'
          ? 'सूचना निगरानी बंद कर दी गई है।'
          : 'Notification monitoring has been stopped.'
      );
    } catch (error) {
      console.error('Error stopping listener:', error);
    }
  };

  const handleNotificationReceived = (notification: NotificationData) => {
    console.log('📱 New notification:', notification.type, notification.appName);

    // Analyze for fraud
    const analysis = analyzeSMS(notification.appName, notification.content);
    
    // Update stats
    setFraudStats(prev => ({
      total: prev.total + 1,
      safe: prev.safe + (analysis.fraudScore < 20 ? 1 : 0),
      suspicious: prev.suspicious + (analysis.fraudScore >= 20 && analysis.fraudScore < 60 ? 1 : 0),
      dangerous: prev.dangerous + (analysis.fraudScore >= 60 ? 1 : 0),
    }));

    // Add to recent notifications
    setRecentNotifications(prev => [
      {
        ...notification,
        fraudScore: analysis.fraudScore,
      } as any,
      ...prev.slice(0, 19), // Keep last 20
    ]);

    // Alert if dangerous
    if (analysis.fraudScore >= 60) {
      Alert.alert(
        language === 'hi' ? '🚨 धोखाधड़ी चेतावनी!' : '🚨 Fraud Alert!',
        language === 'hi'
          ? `⚠️ ${notification.appName} से संदिग्ध सूचना!\n\n📊 धोखाधड़ी जोखिम: ${analysis.fraudScore}%\n\n${notification.content.substring(0, 100)}...\n\n❌ कोई कार्रवाई न करें!`
          : `⚠️ Suspicious notification from ${notification.appName}!\n\n📊 Fraud Risk: ${analysis.fraudScore}%\n\n${notification.content.substring(0, 100)}...\n\n❌ Do NOT take any action!`,
        [
          {
            text: language === 'hi' ? 'समझ गया' : 'Understood',
            style: 'cancel',
          },
          {
            text: language === 'hi' ? 'विवरण देखें' : 'View Details',
            onPress: () => {
              // Navigate to details (implement as needed)
              console.log('Navigate to fraud details');
            },
          },
        ]
      );
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 60) return '#ef4444'; // Red
    if (score >= 20) return '#f97316'; // Orange
    return '#22c55e'; // Green
  };

  const getRiskLabel = (score: number) => {
    if (score >= 60) return language === 'hi' ? 'खतरनाक' : 'Dangerous';
    if (score >= 20) return language === 'hi' ? 'संदिग्ध' : 'Suspicious';
    return language === 'hi' ? 'सुरक्षित' : 'Safe';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      SMS: '📱',
      WhatsApp: '💬',
      Telegram: '✈️',
      Email: '📧',
      Banking: '🏦',
      OTP: '🔐',
      SocialMedia: '📱',
      Other: '🔔',
    };
    return icons[type] || '🔔';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {language === 'hi' ? '🔔 सूचना निगरानी' : '🔔 Notification Monitor'}
        </Text>
        <Text style={styles.subtitle}>
          {language === 'hi'
            ? 'सभी ऐप्स की सूचनाओं को स्वचालित रूप से स्कैन करें'
            : 'Automatically scan notifications from all apps'}
        </Text>
      </View>

      {/* Permission Status */}
      {!hasPermission && (
        <View style={styles.permissionCard}>
          <Text style={styles.permissionTitle}>
            {language === 'hi' ? '⚠️ अनुमति आवश्यक' : '⚠️ Permission Required'}
          </Text>
          <Text style={styles.permissionText}>
            {language === 'hi'
              ? 'सूचनाओं को पढ़ने के लिए DigiRakshak को अनुमति दें।'
              : 'Allow DigiRakshak to read notifications.'}
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>
              {language === 'hi' ? '🔐 अनुमति दें' : '🔐 Grant Permission'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Control Button */}
      {hasPermission && (
        <TouchableOpacity
          style={[
            styles.controlButton,
            { backgroundColor: isListening ? '#ef4444' : '#0ea5e9' },
          ]}
          onPress={isListening ? stopListening : startListening}
        >
          <Text style={styles.controlButtonText}>
            {isListening
              ? language === 'hi'
                ? '🔕 निगरानी बंद करें'
                : '🔕 Stop Monitoring'
              : language === 'hi'
              ? '🔔 निगरानी शुरू करें'
              : '🔔 Start Monitoring'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Stats */}
      {isListening && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>
            {language === 'hi' ? '📊 आंकड़े' : '📊 Statistics'}
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{fraudStats.total}</Text>
              <Text style={styles.statLabel}>
                {language === 'hi' ? 'कुल' : 'Total'}
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#dcfce7' }]}>
              <Text style={[styles.statValue, { color: '#22c55e' }]}>{fraudStats.safe}</Text>
              <Text style={styles.statLabel}>
                {language === 'hi' ? 'सुरक्षित' : 'Safe'}
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#ffedd5' }]}>
              <Text style={[styles.statValue, { color: '#f97316' }]}>{fraudStats.suspicious}</Text>
              <Text style={styles.statLabel}>
                {language === 'hi' ? 'संदिग्ध' : 'Suspicious'}
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#fee2e2' }]}>
              <Text style={[styles.statValue, { color: '#ef4444' }]}>{fraudStats.dangerous}</Text>
              <Text style={styles.statLabel}>
                {language === 'hi' ? 'खतरनाक' : 'Dangerous'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Recent Notifications */}
      {recentNotifications.length > 0 && (
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>
            {language === 'hi' ? '📱 हाल की सूचनाएं' : '📱 Recent Notifications'}
          </Text>
          {recentNotifications.map((notif, index) => (
            <View key={index} style={styles.notifCard}>
              <View style={styles.notifHeader}>
                <Text style={styles.notifIcon}>{getTypeIcon(notif.type)}</Text>
                <View style={styles.notifInfo}>
                  <Text style={styles.notifApp}>{notif.appName}</Text>
                  <Text style={styles.notifType}>{notif.type}</Text>
                </View>
                <View
                  style={[
                    styles.riskBadge,
                    { backgroundColor: getRiskColor((notif as any).fraudScore) },
                  ]}
                >
                  <Text style={styles.riskText}>
                    {(notif as any).fraudScore}%
                  </Text>
                </View>
              </View>
              <Text style={styles.notifContent} numberOfLines={2}>
                {notif.content}
              </Text>
              <Text style={styles.notifTime}>
                {new Date(notif.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          {language === 'hi' ? '💡 कैसे काम करता है?' : '💡 How it works?'}
        </Text>
        <Text style={styles.infoText}>
          {language === 'hi'
            ? '1️⃣ "निगरानी शुरू करें" क्लिक करें\n2️⃣ कोई भी सूचना आने पर हम स्वचालित रूप से स्कैन करेंगे\n3️⃣ धोखाधड़ी का पता चलने पर तुरंत चेतावनी मिलेगी\n4️⃣ सभी ऐप्स के लिए काम करता है - SMS, WhatsApp, Email, Banking!'
            : '1️⃣ Click "Start Monitoring"\n2️⃣ When any notification arrives, we automatically scan it\n3️⃣ Get instant alerts if fraud is detected\n4️⃣ Works for all apps - SMS, WhatsApp, Email, Banking!'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#0ea5e9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  permissionCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#856404',
  },
  permissionText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 16,
  },
  permissionButton: {
    backgroundColor: '#ffc107',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#856404',
    fontWeight: 'bold',
    fontSize: 16,
  },
  controlButton: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  controlButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  statsContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  recentSection: {
    margin: 16,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  notifCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  notifIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  notifInfo: {
    flex: 1,
  },
  notifApp: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notifType: {
    fontSize: 12,
    color: '#64748b',
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  notifContent: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 8,
  },
  notifTime: {
    fontSize: 12,
    color: '#94a3b8',
  },
  infoCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0ea5e9',
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0c4a6e',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#0c4a6e',
    lineHeight: 22,
  },
});
