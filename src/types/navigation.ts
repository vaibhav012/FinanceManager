import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// src/types/navigation.ts
export type RootTabParamList = {
  Home: undefined;
  Categories: undefined;
  Accounts: undefined;
  Transactions: undefined;
};

export const Tab = createBottomTabNavigator<RootTabParamList>();
