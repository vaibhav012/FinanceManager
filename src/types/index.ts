export interface Message {
  id: string;
  body: string;
  sender: string;
  timestamp: number;
}

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export type Transaction = {
  id: string | null;
  account: string | null;
  amount: number | null;
  date: string | null;
  time: string | null;
  type: 'credit' | 'debit' | null;
  purpose: string | null;
  category: string | null;
  messageId: string | null;
  createdAt: string | null;
  remarks?: string;
};

export type AccountType = 'Savings' | 'Credit Card' | 'Loan';

export type Account = {
  id: string;
  senderID: string;
  accountNumberEndsWith: string;
  messageRegex: string[];
  bankName: string;
  accountType: AccountType;
};
