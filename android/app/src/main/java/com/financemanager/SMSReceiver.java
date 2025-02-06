package com.financemanager; // Replace with your package name

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.provider.Telephony;
import android.telephony.SmsMessage;
import android.util.Log;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactContext;

public class SMSReceiver extends BroadcastReceiver {
    private static ReactContext reactContext;

    public static void setReactContext(ReactContext context) {
        reactContext = context;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        if (Telephony.Sms.Intents.SMS_RECEIVED_ACTION.equals(intent.getAction())) {
            SmsMessage[] messages = Telephony.Sms.Intents.getMessagesFromIntent(intent);
            
            for (SmsMessage message : messages) {
                String messageBody = message.getMessageBody();
                String sender = message.getOriginatingAddress();

                // Create event data
                WritableMap eventData = Arguments.createMap();
                eventData.putString("body", messageBody);
                eventData.putString("sender", sender);
                eventData.putDouble("timestamp", System.currentTimeMillis());

                // Send event to React Native
                if (reactContext != null) {
                    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("sms_received", eventData);
                }
            }
        }
    }
}