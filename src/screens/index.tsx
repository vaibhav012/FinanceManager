import HomeScreen from './HomeScreen';
import CategoriesScreen from './CategoriesScreen';
import AccountsScreen from './AccountsScreen';
import TransactionsScreen from './transactions/transactions-screen';

export const screens = {
  Home: HomeScreen,
  Categories: CategoriesScreen,
  Accounts: AccountsScreen,
  Transactions: TransactionsScreen,
} as const;

export type ScreenName = keyof typeof screens;
