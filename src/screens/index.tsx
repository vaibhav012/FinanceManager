import MessagesScreen from './messages/messages-screen';
import CategoriesScreen from './categories-screen';
import AccountsScreen from './accounts-screen';
import TransactionsScreen from './transactions/transactions-screen';

export const screens = {
  Transactions: TransactionsScreen,
  Accounts: AccountsScreen,
  Messages: MessagesScreen,
  Categories: CategoriesScreen,
} as const;

export type ScreenName = keyof typeof screens;
