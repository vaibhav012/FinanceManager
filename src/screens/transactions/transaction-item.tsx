import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Category, Transaction, Account} from '../../types';
import styles from './styles';
import commonStyles from '../../common/styles';

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
            ₹{item.amount} :: {item.purpose || 'No Purpose'}
          </Text>
        </View>
        <View style={styles.transactionDataRow}>
          <Text style={styles.accountText}>
            {account ? `${account.bankName} (${account.accountNumberEndsWith})` : 'Unknown Account'}
          </Text>
          <Text style={styles.categoryText}>Category: {category?.name || 'Uncategorized'}</Text>
        </View>
        <Text style={styles.detailsText}>
          {item.type} | {new Date(item.date || '').toLocaleDateString()} | {item.time}
        </Text>
        {item.remarks && <Text style={styles.remarksText}>Remarks: {item.remarks}</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={commonStyles.deleteButton} onPress={onDelete}>
        <Text style={commonStyles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TransactionItem;
