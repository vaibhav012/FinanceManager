import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MessageProvider, useMessages } from './src/context/MessageContext';
import { usePermissionsSetup } from './src/hooks/usePermissionsSetup';
import { screens } from './src/screens';
import TabBarIcon from './tab-bar-icon';
import ImportExportScreen from './src/screens/import-export/import-export-screen';
import type { RootDrawerParamList, RootTabParamList } from './src/types/navigation';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Drawer = createDrawerNavigator<RootDrawerParamList>();

const TabNavigator = () => {
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
        <Drawer.Navigator
          screenOptions={{
            drawerType: 'front',
            drawerStyle: {
              backgroundColor: '#fff',
              width: '75%',
            },
          }}
        >
          <Drawer.Screen
            name="MainTabs"
            component={TabNavigator}
            options={{
              title: 'Home',
              headerShown: true,
            }}
          />
          <Drawer.Screen
            name="ImportExport"
            component={ImportExportScreen}
            options={{
              title: 'Import/Export Data',
              headerShown: true,
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </MessageProvider>
  </SafeAreaProvider>
);

export default App;
