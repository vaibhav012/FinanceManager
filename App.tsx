// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MessageProvider, useMessages } from './src/context/MessageContext';
import { usePermissionsSetup } from './src/hooks/usePermissionsSetup';
import { screens } from './src/screens/index';
import type { RootTabParamList } from './src/types/navigation';
import TabBarIcon from './tab-bar-icon';

const Tab = createBottomTabNavigator<RootTabParamList>();

const AppContent = () => {
  const { addMessage } = useMessages();
  usePermissionsSetup(addMessage);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: () => <TabBarIcon route={route} />,
        tabBarActiveTintColor: '#6200ea',
        tabBarInactiveTintColor: '#3e2465',
        tabBarStyle: { backgroundColor: '#f8f8f8' },
        headerShown: false,
      })}
    >
      {Object.entries(screens).map(([name, Component]) => (
        <Tab.Screen
          key={name}
          name={name as keyof RootTabParamList}
          component={Component}
        />
      ))}
    </Tab.Navigator>
  );
};

const App = () => (
  <SafeAreaProvider>
    <MessageProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </MessageProvider>
  </SafeAreaProvider>
);

export default App;
