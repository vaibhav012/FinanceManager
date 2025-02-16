// src/hooks/usePermissionsSetup.ts
import {useEffect} from 'react';
import {PermissionsAndroid, Platform, Alert} from 'react-native';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
import {startForegroundService} from '../services/ForegroundService';

export const usePermissionsSetup = (addMessage: (message: any) => void) => {
  useEffect(() => {
    const setupService = async () => {
      if (Platform.OS !== 'android') {
        return;
      }

      try {
        const settings = await notifee.getNotificationSettings();
        if (settings.authorizationStatus !== AuthorizationStatus.AUTHORIZED) {
          await notifee.requestPermission();
        }

        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);

        const allGranted = Object.values(granted).every(
          permission => permission === PermissionsAndroid.RESULTS.GRANTED,
        );

        if (allGranted) {
          await startForegroundService(addMessage);
        } else {
          Alert.alert('Permission Required', 'SMS permissions are required for this app to function properly', [
            {text: 'OK'},
          ]);
        }
      } catch (error) {
        console.error('Error setting up service:', error);
        Alert.alert('Error', 'Failed to start SMS monitoring service', [{text: 'OK'}]);
      }
    };

    setupService();
  }, [addMessage]);
};
