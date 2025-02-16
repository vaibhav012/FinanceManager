import {STORAGE_KEYS} from '.';
import {Account, Category, Message, Transaction} from '../types';

export const DUMMY_DATA: {
  messages?: Message[];
  '@accounts'?: Account[];
  '@categories'?: Category[];
  '@transactions'?: Transaction[];
} = {
  [STORAGE_KEYS.MESSAGES]: [
    {
      id: 'msg1',
      sender: 'HDFCBK',
      body: 'Rs.2500 spent on HDFC Bank Card x1234 at Amazon on 2025-02-15:14:30:25:123',
      timestamp: 1708002625123,
    },
    {
      id: 'msg2',
      sender: 'AXISBK',
      body: 'Spent\nCard no. ******1234 spent INR 10000 on 2025-02-15:14:30:25:123 at Amazon',
      timestamp: 1707916530456,
    },
    {
      id: 'msg3',
      sender: 'JD-SBICRD',
      body: 'Rs.123.00 spent on your SBI Credit Card ending 1234 at Swiggy IN on 13/02/25. Trxn. not done by you? Report at https://sbicard.com/Dispute',
      timestamp: 1707916530456,
    },
  ],
  [STORAGE_KEYS.ACCOUNTS]: [
    {
      id: 'acc1',
      senderID: 'HDFCBK',
      accountNumberEndsWith: '1234',
      messageRegex: [
        'Rs\\.(?<amount>\\d+) spent on HDFC Bank Card x(?<last4>\\d+) at \\.?(?<merchant>.+?) on (?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2}):(?<hour>\\d{2}):(?<minute>\\d{2}):(?<second>\\d{2})',
      ],
      bankName: 'HDFC Bank',
      accountType: 'Credit Card',
    },
    {
      id: 'acc2',
      senderID: 'AXISBK',
      accountNumberEndsWith: '5678',
      messageRegex: [
        'Spent\nCard no\\. (?<card_no>[A-Z0-9]+)\nINR (?<amount>\\d+)\n(?<day>\\d{2})-(?<month>\\d{2})-(?<year>\\d{2}) (?<hour>\\d{2}):(?<minute>\\d{2}):(?<second>\\d{2})\n(?<merchant>.+?)\nAvl Lmt INR (?<available_limit>\\d+)',
      ],
      bankName: 'ICICI Bank',
      accountType: 'Credit Card',
    },
    {
      id: 'acc3',
      senderID: 'SBICRD',
      accountNumberEndsWith: '9101',
      messageRegex: [
        'Rs\\.(?<amount>\\d+(?:,\\d+)*(?:\\.\\d+)?) spent on your SBI Credit Card ending (?<last4>\\d+) at (?<merchant>.+?) on (?<day>\\d{2})\\/(?<month>\\d{2})\\/(?<year>\\d{2})',
      ],
      bankName: 'SBI Bank',
      accountType: 'Credit Card',
    },
  ],
};
