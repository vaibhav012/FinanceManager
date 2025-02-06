import {Account, Message, Transaction} from '../types';

export const compileMessages = (
  messages: Message[],
  accounts: Account[],
): Transaction[] => {
  const transactions: Transaction[] = [];

  messages.forEach(message => {
    // Try to find matching account based on senderID
    const matchingAccount = accounts.find(account =>
      message.sender.includes(account.senderID),
    );

    if (!matchingAccount) {
      return; // Skip if no matching account found
    }

    console.log('VVVV', message, matchingAccount);

    // Try each regex pattern for the account until we find a match
    let extractedData: Transaction | null = null;
    for (const pattern of matchingAccount.messageRegex) {
      try {
        // const regex = /Spent\s*\nCard No\.\s*([A-Z0-9]+)\s*\n(\d{2}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})\s*\n(.+?)\s*\nAvl Lmt INR\s*(\d+)/;
        const regex = new RegExp(pattern, 'm'); // 'm' enables multi-line matching
        const match = message.body.match(regex);

        if (match) {
          extractedData = {
            account: matchingAccount.id,
            id: Date.now().toString(),
            amount: Number.parseFloat(match[2]),
            date: match[3],
            time: match[4],
            type: 'debit',
            purpose: match[5],
            category: '',
          };
        }

        console.log('VVVV', message.body, pattern, regex, extractedData);
      } catch (error) {
        console.error(`Invalid regex pattern: ${pattern}`, error);
      }
    }

    if (!extractedData) {
      return; // Skip if no pattern matched
    }

    // Create transaction if we have at least amount and type
    if (extractedData.amount != null && extractedData.type != null) {
      const transaction: Transaction = {
        id: generateTransactionId(),
        account: matchingAccount.id,
        amount: extractedData.amount,
        type: extractedData.type,
        date: extractedData.date || new Date(message.timestamp),
        time: extractedData.time || formatTime(message.timestamp),
        purpose: extractedData.purpose || 'Unknown',
        category: extractedData.category || 'Others',
        messageId: message.id,
        createdAt: new Date(),
      };

      transactions.push(transaction);
    }
  });

  return transactions;
};

const extractDataFromMessage = (
  messageBody: string,
  pattern: string,
): Transaction => {
  const data: Transaction = {
    amount: null,
    account: null,
    date: null,
    time: null,
    type: null,
    purpose: null,
    category: null,
  };

  // Common regex patterns for different fields
  const patterns = {
    amount: /(?:RS|INR|₹)\.?\s*([0-9,]+\.?[0-9]*)/i,
    date: /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/,
    time: /(\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)/,
    creditKeywords: /credit|credited|received|added|deposited/i,
    debitKeywords: /debit|debited|spent|withdrawn|paid/i,
  };

  // Extract amount
  const amountMatch = messageBody.match(patterns.amount);
  if (amountMatch) {
    data.amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  }

  // Extract date
  const dateMatch = messageBody.match(patterns.date);
  if (dateMatch) {
    data.date = parseDate(dateMatch[1]);
  }

  // Extract time
  const timeMatch = messageBody.match(patterns.time);
  if (timeMatch) {
    data.time = timeMatch[1];
  }

  // Determine transaction type
  if (patterns.creditKeywords.test(messageBody)) {
    data.type = 'credit';
  } else if (patterns.debitKeywords.test(messageBody)) {
    data.type = 'debit';
  }

  // Extract purpose (usually the sender/receiver or merchant name)
  // This is more complex and might need customization based on your message formats
  const purposeMatch = messageBody.match(
    /(?:to|from|at|by)\s+([A-Za-z0-9\s&]+)/i,
  );
  if (purposeMatch) {
    data.purpose = purposeMatch[1].trim();
  }

  // Category will be determined later based on purpose or manual selection
  data.category = determineCategory(data.purpose || '');

  return data;
};

const parseDate = (dateStr: string): Date | null => {
  try {
    const [day, month, year] = dateStr.split(/[-/]/).map(Number);
    const fullYear = year < 100 ? 2000 + year : year;
    return new Date(fullYear, month - 1, day);
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};

const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const generateTransactionId = (): string => {
  return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const determineCategory = (purpose: string): string => {
  // This is a basic implementation - you might want to enhance this
  // based on your specific categories and common merchant names
  const categoryPatterns = {
    Shopping: /(mart|shop|store|retail|amazon|flipkart)/i,
    Food: /(restaurant|cafe|food|swiggy|zomato)/i,
    Transfer: /(transfer|sent|received|upi|paytm)/i,
    Bills: /(bill|recharge|electricity|water|gas|broadband)/i,
  };

  for (const [category, pattern] of Object.entries(categoryPatterns)) {
    if (pattern.test(purpose)) {
      return category;
    }
  }

  return 'Others';
};

export const recompileTransaction = (
  message: Message,
  account: Account,
  existingTransaction?: Transaction,
): Transaction | null => {
  const compiledTransactions = compileMessages([message], [account]);
  if (compiledTransactions.length === 0) {
    return null;
  }

  const newTransaction = compiledTransactions[0];
  if (existingTransaction) {
    return {
      ...newTransaction,
      id: existingTransaction.id,
      category: existingTransaction.category, // Preserve user-set category
      createdAt: existingTransaction.createdAt,
    };
  }

  return newTransaction;
};
