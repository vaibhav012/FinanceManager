package com.financemanager; // Replace with your package name

import android.content.IntentFilter;
import android.provider.Telephony;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class SMSModule extends ReactContextBaseJavaModule {
    private SMSReceiver smsReceiver;

    public SMSModule(ReactApplicationContext reactContext) {
        super(reactContext);
        SMSReceiver.setReactContext(reactContext);
    }

    @Override
    public String getName() {
        return "SMSModule";
    }

    @ReactMethod
    public void startSMSListener() {
        if (smsReceiver == null) {
            smsReceiver = new SMSReceiver();
            IntentFilter filter = new IntentFilter(Telephony.Sms.Intents.SMS_RECEIVED_ACTION);
            getReactApplicationContext().registerReceiver(smsReceiver, filter);
        }
    }

    @ReactMethod
    public void stopSMSListener() {
        if (smsReceiver != null) {
            getReactApplicationContext().unregisterReceiver(smsReceiver);
            smsReceiver = null;
        }
    }
}