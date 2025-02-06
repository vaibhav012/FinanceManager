import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import SendersScreen from './src/screens/SendersScreen';
import AccountsScreen from './src/screens/AccountsScreen';
import {MessageProvider} from './src/context/MessageContext';
import {startForegroundService} from './src/services/ForegroundService';
import {useMessages} from './src/context/MessageContext';
import {PermissionsAndroid, Platform, Alert} from 'react-native';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TransactionsScreen from './src/screens/TransactionsScreen';

export type RootStackParamList = {
  Home: undefined;
  Categories: undefined;
  Senders: undefined;
  Transactions: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const AppContent = () => {
  const {addMessage} = useMessages();

  useEffect(() => {
    const setupService = async () => {
      if (Platform.OS === 'android') {
        try {
          // Check notification settings
          const settings = await notifee.getNotificationSettings();

          if (settings.authorizationStatus !== AuthorizationStatus.AUTHORIZED) {
            await notifee.requestPermission();
          }

          // Request both SMS permissions
          const smsPermissions = [
            PermissionsAndroid.PERMISSIONS.READ_SMS,
            PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
          ];

          const granted = await PermissionsAndroid.requestMultiple(
            smsPermissions,
          );

          if (
            granted['android.permission.READ_SMS'] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.RECEIVE_SMS'] ===
              PermissionsAndroid.RESULTS.GRANTED
          ) {
            await startForegroundService(addMessage);
          } else {
            Alert.alert(
              'Permission Required',
              'SMS permissions are required for this app to function properly',
              [{text: 'OK'}],
            );
          }
        } catch (error) {
          console.error('Error setting up service:', error);
          Alert.alert('Error', 'Failed to start SMS monitoring service', [
            {text: 'OK'},
          ]);
        }
      }
    };

    setupService();
  }, [addMessage]);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Categories':
              iconName = 'shape';
              break;
            case 'Accounts':
              iconName = 'account-multiple';
              break;
            case 'Transactions':
              iconName = 'account-multiple';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ea',
        tabBarInactiveTintColor: '#3e2465',
        tabBarStyle: {
          backgroundColor: '#f8f8f8',
        },
        headerShown: false,
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Accounts" component={AccountsScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <MessageProvider>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </MessageProvider>
    </SafeAreaProvider>
  );
};

export default App;
