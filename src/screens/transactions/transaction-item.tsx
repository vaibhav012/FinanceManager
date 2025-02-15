import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Category, Transaction, Account} from '../../types';
import styles from './styles';

const TransactionItem = ({
  item,
  accounts,
  onClick,
  categories,
  onDelete,
}: {
  item: Transaction;
  accounts: Account[];
  onClick: () => void;
  onDelete: () => void;
  categories: Category[];
}) => {
  const getAccountDetails = (accountId: string) => {
    console.log(accountId, accounts);
    return accounts.find(account => account.id === accountId);
  };

  const account = getAccountDetails(item.account || '');
  const category = categories.find(cat => cat.id === item.category);

  return (
    <View style={styles.transactionContainer}>
      <TouchableOpacity onPress={onClick} style={styles.transactionItem}>
        <View style={styles.transactionHeader}>
          <Text style={styles.purposeText}>
            {item.purpose || 'No Purpose'} - ₹{item.amount}
          </Text>
          <Text style={styles.accountText}>
            {account ? `${account.bankName} (${account.accountNumberEndsWith})` : 'Unknown Account'}
          </Text>
        </View>
        <Text style={styles.detailsText}>
          {item.type} | {item.date} | {new Date(item.date || '').toLocaleDateString()} | {item.time}
        </Text>
        <Text style={styles.categoryText}>Category: {category?.name || 'Uncategorized'}</Text>
        {item.remarks && <Text style={styles.remarksText}>Remarks: {item.remarks}</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TransactionItem;
