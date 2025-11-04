package com.digirakshak;

import android.app.Notification;
import android.content.Intent;
import android.os.Bundle;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.util.Log;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import org.json.JSONObject;
import org.json.JSONException;

/**
 * DigiRakshak Notification Listener Service
 * 
 * Listens to ALL notifications from:
 * - SMS (Messages app)
 * - WhatsApp
 * - Telegram
 * - Email (Gmail, Outlook)
 * - Banking apps (Paytm, PhonePe, GPay, bank apps)
 * - Social media
 * - Any other app
 * 
 * Automatically detects fraud patterns in real-time!
 */
public class NotificationListenerService extends android.service.notification.NotificationListenerService {

    private static final String TAG = "DigiRakshak_NotifListener";
    public static final String ACTION_NEW_NOTIFICATION = "com.digirakshak.NEW_NOTIFICATION";

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "✅ DigiRakshak Notification Listener Service Started");
    }

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        try {
            String packageName = sbn.getPackageName();
            Notification notification = sbn.getNotification();
            Bundle extras = notification.extras;

            // Extract notification details
            String title = extras.getString(Notification.EXTRA_TITLE, "");
            String text = extras.getCharSequence(Notification.EXTRA_TEXT, "").toString();
            String subText = extras.getString(Notification.EXTRA_SUB_TEXT, "");
            String bigText = extras.getCharSequence(Notification.EXTRA_BIG_TEXT, "").toString();
            
            // Combine all text content
            String fullContent = (title + " " + text + " " + subText + " " + bigText).trim();

            // Only process if there's actual content
            if (fullContent.isEmpty() || fullContent.length() < 10) {
                return;
            }

            // Detect notification type
            String notificationType = detectNotificationType(packageName, title, fullContent);

            // Log for debugging
            Log.d(TAG, "📱 New Notification Detected:");
            Log.d(TAG, "   App: " + packageName);
            Log.d(TAG, "   Type: " + notificationType);
            Log.d(TAG, "   Title: " + title);
            Log.d(TAG, "   Content: " + fullContent.substring(0, Math.min(fullContent.length(), 100)));

            // Create JSON object with notification data
            JSONObject notificationData = new JSONObject();
            notificationData.put("packageName", packageName);
            notificationData.put("appName", getAppName(packageName));
            notificationData.put("type", notificationType);
            notificationData.put("title", title);
            notificationData.put("content", fullContent);
            notificationData.put("timestamp", System.currentTimeMillis());

            // Send to React Native
            Intent intent = new Intent(ACTION_NEW_NOTIFICATION);
            intent.putExtra("notification", notificationData.toString());
            LocalBroadcastManager.getInstance(this).sendBroadcast(intent);

            Log.d(TAG, "✅ Notification sent to React Native");

        } catch (JSONException e) {
            Log.e(TAG, "❌ Error processing notification: " + e.getMessage());
        } catch (Exception e) {
            Log.e(TAG, "❌ Unexpected error: " + e.getMessage());
        }
    }

    @Override
    public void onNotificationRemoved(StatusBarNotification sbn) {
        // Optional: Handle notification removal
        Log.d(TAG, "🗑️ Notification removed: " + sbn.getPackageName());
    }

    /**
     * Detect the type of notification based on package name and content
     */
    private String detectNotificationType(String packageName, String title, String content) {
        String lowerPackage = packageName.toLowerCase();
        String lowerContent = (title + " " + content).toLowerCase();

        // SMS / Messaging Apps
        if (lowerPackage.contains("messaging") || 
            lowerPackage.contains("sms") ||
            lowerPackage.equals("com.google.android.apps.messaging") ||
            lowerPackage.equals("com.samsung.android.messaging")) {
            return "SMS";
        }

        // WhatsApp
        if (lowerPackage.contains("whatsapp")) {
            return "WhatsApp";
        }

        // Telegram
        if (lowerPackage.contains("telegram")) {
            return "Telegram";
        }

        // Email Apps
        if (lowerPackage.contains("gmail") || 
            lowerPackage.contains("email") ||
            lowerPackage.contains("outlook") ||
            lowerPackage.contains("mail")) {
            return "Email";
        }

        // Banking & Payment Apps
        if (lowerPackage.contains("paytm") ||
            lowerPackage.contains("phonepe") ||
            lowerPackage.contains("googlepay") ||
            lowerPackage.contains("gpay") ||
            lowerPackage.contains("bhim") ||
            lowerPackage.contains("bank") ||
            lowerPackage.contains("sbi") ||
            lowerPackage.contains("hdfc") ||
            lowerPackage.contains("icici") ||
            lowerPackage.contains("axis") ||
            lowerContent.contains("upi") ||
            lowerContent.contains("payment") ||
            lowerContent.contains("transaction")) {
            return "Banking";
        }

        // OTP Detection
        if (lowerContent.matches(".*\\b\\d{4,6}\\b.*") && 
            (lowerContent.contains("otp") || 
             lowerContent.contains("verification") ||
             lowerContent.contains("code"))) {
            return "OTP";
        }

        // Social Media
        if (lowerPackage.contains("facebook") ||
            lowerPackage.contains("instagram") ||
            lowerPackage.contains("twitter") ||
            lowerPackage.contains("linkedin")) {
            return "SocialMedia";
        }

        // Default
        return "Other";
    }

    /**
     * Get human-readable app name from package name
     */
    private String getAppName(String packageName) {
        if (packageName.contains("messaging")) return "Messages";
        if (packageName.contains("whatsapp")) return "WhatsApp";
        if (packageName.contains("telegram")) return "Telegram";
        if (packageName.contains("gmail")) return "Gmail";
        if (packageName.contains("outlook")) return "Outlook";
        if (packageName.contains("paytm")) return "Paytm";
        if (packageName.contains("phonepe")) return "PhonePe";
        if (packageName.contains("gpay")) return "Google Pay";
        if (packageName.contains("sbi")) return "SBI";
        if (packageName.contains("hdfc")) return "HDFC Bank";
        if (packageName.contains("icici")) return "ICICI Bank";
        
        // Extract app name from package (e.g., com.example.app -> App)
        String[] parts = packageName.split("\\.");
        if (parts.length > 0) {
            String lastPart = parts[parts.length - 1];
            return lastPart.substring(0, 1).toUpperCase() + lastPart.substring(1);
        }
        
        return packageName;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "❌ DigiRakshak Notification Listener Service Stopped");
    }
}
