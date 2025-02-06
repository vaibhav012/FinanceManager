// src/services/SMSService.ts
import { NativeEventEmitter, NativeModules } from 'react-native';

const { SMSModule } = NativeModules;

class SMSService {
  private eventEmitter: NativeEventEmitter;
  private listeners: any[] = [];

  constructor() {
    this.eventEmitter = new NativeEventEmitter(SMSModule);
  }

  start(onMessageReceived: (message: any) => void) {
    // Start the native SMS listener
    SMSModule.startSMSListener();

    // Listen for SMS events
    const listener = this.eventEmitter.addListener('sms_received', (event) => {
      console.log('SMS Received Listener')
      onMessageReceived(event);
    });

    this.listeners.push(listener);
  }

  stop() {
    // Remove all listeners
    this.listeners.forEach(listener => listener.remove());
    this.listeners = [];

    // Stop the native SMS listener
    SMSModule.stopSMSListener();
  }
}

export default new SMSService();