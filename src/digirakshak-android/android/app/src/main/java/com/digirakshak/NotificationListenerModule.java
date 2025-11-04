package com.digirakshak;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.provider.Settings;
import android.text.TextUtils;
import android.util.Log;

import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONObject;

/**
 * React Native Bridge for Notification Listener
 * 
 * Provides methods to:
 * 1. Check if notification access is granted
 * 2. Open notification settings
 * 3. Start/Stop listening to notifications
 * 4. Receive notifications in React Native
 */
public class NotificationListenerModule extends ReactContextBaseJavaModule {

    private static final String TAG = "NotificationListenerModule";
    private static final String MODULE_NAME = "NotificationListener";
    
    private ReactApplicationContext reactContext;
    private BroadcastReceiver notificationReceiver;
    private boolean isListening = false;

    public NotificationListenerModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    /**
     * Check if notification access permission is granted
     */
    @ReactMethod
    public void isNotificationAccessGranted(Promise promise) {
        try {
            boolean isGranted = isNotificationServiceEnabled();
            promise.resolve(isGranted);
        } catch (Exception e) {
            promise.reject("ERROR", "Failed to check notification access: " + e.getMessage());
        }
    }

    /**
     * Open notification access settings
     */
    @ReactMethod
    public void openNotificationSettings(Promise promise) {
        try {
            Intent intent = new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            reactContext.startActivity(intent);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("ERROR", "Failed to open settings: " + e.getMessage());
        }
    }

    /**
     * Start listening to notifications
     */
    @ReactMethod
    public void startListening(Promise promise) {
        try {
            if (!isNotificationServiceEnabled()) {
                promise.reject("PERMISSION_DENIED", "Notification access not granted");
                return;
            }

            if (isListening) {
                promise.resolve("Already listening");
                return;
            }

            // Register broadcast receiver
            notificationReceiver = new BroadcastReceiver() {
                @Override
                public void onReceive(Context context, Intent intent) {
                    try {
                        String notificationJson = intent.getStringExtra("notification");
                        if (notificationJson != null) {
                            JSONObject json = new JSONObject(notificationJson);
                            
                            WritableMap params = Arguments.createMap();
                            params.putString("packageName", json.getString("packageName"));
                            params.putString("appName", json.getString("appName"));
                            params.putString("type", json.getString("type"));
                            params.putString("title", json.getString("title"));
                            params.putString("content", json.getString("content"));
                            params.putDouble("timestamp", json.getLong("timestamp"));

                            // Send event to React Native
                            reactContext
                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("onNotificationReceived", params);

                            Log.d(TAG, "✅ Notification sent to React Native: " + json.getString("type"));
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "❌ Error processing notification: " + e.getMessage());
                    }
                }
            };

            IntentFilter filter = new IntentFilter(NotificationListenerService.ACTION_NEW_NOTIFICATION);
            LocalBroadcastManager.getInstance(reactContext).registerReceiver(notificationReceiver, filter);
            
            isListening = true;
            Log.d(TAG, "✅ Started listening to notifications");
            promise.resolve("Listening started");

        } catch (Exception e) {
            promise.reject("ERROR", "Failed to start listening: " + e.getMessage());
        }
    }

    /**
     * Stop listening to notifications
     */
    @ReactMethod
    public void stopListening(Promise promise) {
        try {
            if (notificationReceiver != null) {
                LocalBroadcastManager.getInstance(reactContext).unregisterReceiver(notificationReceiver);
                notificationReceiver = null;
            }
            
            isListening = false;
            Log.d(TAG, "🔕 Stopped listening to notifications");
            promise.resolve("Listening stopped");

        } catch (Exception e) {
            promise.reject("ERROR", "Failed to stop listening: " + e.getMessage());
        }
    }

    /**
     * Check if notification listener service is enabled
     */
    private boolean isNotificationServiceEnabled() {
        String packageName = reactContext.getPackageName();
        String flat = Settings.Secure.getString(reactContext.getContentResolver(),
                "enabled_notification_listeners");
        
        if (!TextUtils.isEmpty(flat)) {
            String[] names = flat.split(":");
            for (String name : names) {
                if (name.contains(packageName)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Cleanup when module is destroyed
     */
    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        if (notificationReceiver != null) {
            try {
                LocalBroadcastManager.getInstance(reactContext).unregisterReceiver(notificationReceiver);
            } catch (Exception e) {
                Log.e(TAG, "Error unregistering receiver: " + e.getMessage());
            }
        }
    }
}
