import MessagesScreen from './messages/messages-screen';
import CategoriesScreen from './CategoriesScreen';
import AccountsScreen from './AccountsScreen';
import TransactionsScreen from './transactions/transactions-screen';

export const screens = {
  Transactions: TransactionsScreen,
  Accounts: AccountsScreen,
  Messages: MessagesScreen,
  Categories: CategoriesScreen,
} as const;

export type ScreenName = keyof typeof screens;
