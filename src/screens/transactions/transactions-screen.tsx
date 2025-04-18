import React, {useState} from 'react';
import {View, FlatList, Text, Modal, KeyboardAvoidingView, Platform, Alert, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Category, Transaction, Account} from '../../types';
import styles from './styles';
import TransactionItem from './transaction-item';
import TransactionForm from './transaction-form';
import MonthSelector from '../../common/month-selector/month-selector';
import GroupFilters, {GroupBy} from './group-filters';
import {STORAGE_KEYS} from '../../utils/storage';
import Button from '../../common/Button';
import {useFocusEffect} from '@react-navigation/native';

type GroupedTransactions = {
  [key: string]: {
    transactions: Transaction[];
    totalAmount: number;
  };
};

const TransactionsScreen = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [groupBy, setGroupBy] = useState<GroupBy>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<string | null>(
    new Date().toISOString().slice(0, 7), // Format: "YYYY-MM"
  );

  const filterTransactionsByMonth = (txns: Transaction[]) => {
    // Return all transactions if no month filter
    if (!currentMonth) {
      return txns;
    }
    return txns.filter(t => t.date?.startsWith(currentMonth));
  };

  const groupTransactions = (txns: Transaction[]): GroupedTransactions => {
    if (!groupBy) {
      return {};
    }

    return txns.reduce((groups: GroupedTransactions, transaction) => {
      let key = '';
      switch (groupBy) {
        case 'category':
          const category = categories.find(c => c.id === transaction.category);
          key = category?.name || 'Uncategorized';
          break;
        case 'account':
          const account = accounts.find(a => a.id === transaction.account);
          key = account ? `${account.bankName} (${account.accountNumberEndsWith})` : 'Unknown';
          break;
        case 'month':
          key = transaction.date?.slice(0, 7) || 'Unknown';
          break;
        default:
          key = 'Unknown';
      }

      if (!groups[key]) {
        groups[key] = {
          transactions: [],
          totalAmount: 0,
        };
      }

      groups[key].transactions.push(transaction);
      groups[key].totalAmount += transaction.type === 'credit' ? transaction.amount || 0 : -(transaction.amount || 0);

      return groups;
    }, {});
  };

  const loadInitialData = async () => {
    await Promise.all([loadCategories(), loadTransactions(), loadAccounts()]);
  };

  const loadAccounts = async () => {
    try {
      const storedAccounts = await AsyncStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (storedAccounts) {
        setAccounts(JSON.parse(storedAccounts));
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const storedCategories = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      const storedTransactions = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const saveTransactions = async (updatedTransactions: Transaction[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updatedTransactions));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setCurrentTransaction({...transaction}); // Create a copy to avoid direct state mutation
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!currentTransaction) {
      return;
    }

    // Validate required fields
    if (!currentTransaction.amount) {
      Alert.alert('Please fill in amount');
      return;
    }
    if (!currentTransaction.date) {
      Alert.alert('Please fill in date');
      return;
    }
    if (!currentTransaction.time) {
      Alert.alert('Please fill in time');
      return;
    }
    if (!currentTransaction.type) {
      Alert.alert('Please fill in type');
      return;
    }
    if (!currentTransaction.account) {
      Alert.alert('Please fill in account');
      return;
    }
    if (!currentTransaction.purpose) {
      Alert.alert('Please fill in purpose');
      return;
    }

    let updatedTransactions: Transaction[] = [];
    const isExistingTransaction = currentTransaction.id && transactions.find(t => t.id === currentTransaction.id);
    if (isExistingTransaction) {
      updatedTransactions = transactions.map(t => (t.id === currentTransaction.id ? currentTransaction : t));
    } else {
      updatedTransactions = [...transactions, currentTransaction];
    }

    setTransactions(updatedTransactions);
    await saveTransactions(updatedTransactions);
    setModalVisible(false);
    setCurrentTransaction(null);
  };

  const handleAddTransaction = () => {
    const now = new Date();
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      messageId: null,
      createdAt: Date.now.toString(),
      amount: null,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString(),
      type: null,
      purpose: null,
      category: null,
      account: null,
    };

    setCurrentTransaction(newTransaction);
    setModalVisible(true);
  };

  const handleDelete = (transactionId?: string | null) => {
    if (!transactionId) {
      Alert.alert('Invalid TXN ID');
      return;
    }

    Alert.alert('Delete Transaction', 'Are you sure you want to delete this transaction?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updatedTransactions = transactions.filter(t => t.id !== transactionId);
          setTransactions(updatedTransactions);
          await saveTransactions(updatedTransactions);
        },
      },
    ]);
  };

  const handleMonthChange = (month: string) => {
    setCurrentMonth(month);
  };

  const handleClearMonth = () => {
    setCurrentMonth(null);
  };

  const handleGroupChange = (group: GroupBy) => {
    setGroupBy(group);
    setSelectedGroup(null);
  };

  const renderGroupedTransactions = () => {
    const filteredTransactions = filterTransactionsByMonth(transactions);
    const sortedTransactions = filteredTransactions?.sort(
      (a, b) => new Date(b.date ?? '').getTime() - new Date(a.date ?? '').getTime(),
    );
    const groups = groupTransactions(sortedTransactions);

    if (!groupBy || selectedGroup) {
      const transactionsToShow = selectedGroup ? groups[selectedGroup]?.transactions || [] : filteredTransactions;

      return (
        <>
          {selectedGroup && (
            <View style={styles.selectedGroupHeader}>
              <Text style={styles.selectedGroupTitle}>
                {selectedGroup} - Total: ₹{groups[selectedGroup]?.totalAmount.toFixed(2)}
              </Text>
              <TouchableOpacity style={styles.backButton} onPress={() => setSelectedGroup(null)}>
                <Text style={styles.backButtonText}>Back to Groups</Text>
              </TouchableOpacity>
            </View>
          )}
          <FlatList
            data={transactionsToShow}
            keyExtractor={item => item.id || Date.now().toString()}
            renderItem={({item}) => (
              <TransactionItem
                accounts={accounts}
                item={item}
                onClick={() => handleEdit(item)}
                categories={categories}
                onDelete={() => handleDelete(item.id)}
              />
            )}
            style={styles.list}
          />
        </>
      );
    }

    return (
      <FlatList
        data={Object.entries(groups)}
        keyExtractor={([key]) => key}
        renderItem={({item: [key, group]}) => (
          <TouchableOpacity style={styles.groupItem} onPress={() => setSelectedGroup(key)}>
            <Text style={styles.groupTitle}>{key}</Text>
            <Text style={styles.groupSubtitle}>
              {group.transactions.length} transactions | Total: ₹{group.totalAmount.toFixed(2)}
            </Text>
          </TouchableOpacity>
        )}
        style={styles.list}
      />
    );
  };

  useFocusEffect(() => {
    loadInitialData();
  });

  return (
    <View style={styles.transactionsWrapper}>
      {<MonthSelector currentMonth={currentMonth} onChange={handleMonthChange} onClear={handleClearMonth} />}
      {<GroupFilters groupBy={groupBy} onChange={handleGroupChange} />}
      <View style={styles.actionRow}>
        <Button onPress={handleAddTransaction} label="New" />
      </View>

      {renderGroupedTransactions()}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{currentTransaction?.id ? 'Edit Transaction' : 'New Transaction'}</Text>

            {!!currentTransaction && (
              <TransactionForm
                accounts={accounts}
                currentTransaction={currentTransaction}
                onUpdateTransaction={setCurrentTransaction}
                categories={categories}
              />
            )}
            <View style={styles.modalButtons}>
              <Button label="Save" onPress={handleSave} />
              <Button
                label="Cancel"
                onPress={() => {
                  setModalVisible(false);
                  setCurrentTransaction(null);
                }}
                color="red"
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default TransactionsScreen;
