// src/services/ForegroundService.ts
import notifee, { 
  AndroidImportance, 
} from '@notifee/react-native';
import { Message } from '../types';
import SMSService from './SMSService';

const CHANNEL_ID = 'sms_monitor';

export const startForegroundService = async (addMessage: (message: Message) => void) => {
  // Create the notification channel
  const channelId = await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'SMS Monitor',
    lights: false,
    vibration: false,
    importance: AndroidImportance.LOW
  });

  // Register the foreground service with the notification
  notifee.registerForegroundService((notification) => {
    return new Promise(() => {
      // Start SMS listening service
      SMSService.start((event) => {
        const newMessage: Message = {
          id: Date.now().toString(),
          body: event.body,
          sender: event.sender,
          timestamp: event.timestamp,
        };

        console.log('New Message', newMessage)
        addMessage(newMessage);
        // showMessageNotification(newMessage);
      });
    });
  });

  // Display the notification that will be associated with the foreground service
  return await notifee.displayNotification({
    title: 'Finance Manager',
    body: 'Monitoring SMS messages',
    android: {
      channelId,
      asForegroundService: true,
      ongoing: true,
      importance: AndroidImportance.LOW,
      smallIcon: 'ic_notification',
      pressAction: {
        id: 'default',
      }
    },
  });
};

const showMessageNotification = async (message: Message) => {
  const channelId = await notifee.createChannel({
    id: 'new_message',
    name: 'New Messages',
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    title: `New message from ${message.sender}`,
    body: message.body,
    android: {
      channelId,
      pressAction: {
        id: 'default',
      },
    },
  });
};

export const stopForegroundService = async () => {
  // Stop the SMS service
  SMSService.stop();
  
  // Stop the foreground service
  await notifee.stopForegroundService();
};