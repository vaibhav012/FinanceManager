import {Transaction} from '../types';

export const isDuplicateTransaction = (
  newTransaction: Transaction,
  existingTransactions: Transaction[],
  timeThresholdMinutes: number = 5,
): boolean => {
  return existingTransactions.some(existing => {
    // Skip comparing with itself when editing
    if (existing.id === newTransaction.id) {
      return false;
    }

    // Check if basic properties match
    const sameAccount = existing.account === newTransaction.account;
    const sameAmount = existing.amount === newTransaction.amount;

    // Parse dates for comparison
    const existingDate = new Date(`${existing.date} ${existing.time}`);
    const newDate = new Date(`${newTransaction.date} ${newTransaction.time}`);

    // Calculate time difference in minutes
    const timeDifferenceMinutes =
      Math.abs(existingDate.getTime() - newDate.getTime()) / (1000 * 60);

    // Return true if all conditions match within the time threshold
    return (
      sameAccount && sameAmount && timeDifferenceMinutes <= timeThresholdMinutes
    );
  });
};

export const addTransactionIfNotDuplicate = async (
  newTransaction: Transaction,
  existingTransactions: Transaction[],
  onDuplicateFound?: () => void,
): Promise<Transaction[]> => {
  if (isDuplicateTransaction(newTransaction, existingTransactions)) {
    onDuplicateFound?.();
    return existingTransactions;
  }

  return [...existingTransactions, newTransaction];
};

export const updateTransactionSafely = (
  updatedTransactions: Transaction[],
  existingTransactions: Transaction[],
): Transaction[] => {
  const newTransactions = [...existingTransactions];

  updatedTransactions.forEach(updatedTransaction => {
    if(isDuplicateTransaction(updatedTransaction, existingTransactions)){
      // TODO: Update previously added transaction
      return;
    }

    newTransactions.push(updatedTransaction);
  });

  return newTransactions;
};
