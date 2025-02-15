import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Account, AccountType } from '../types';
import { STORAGE_KEYS } from '../constants';
import ListEmptyComponent from './list-empty-state';


const AccountScreen: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [senderID, setSenderID] = useState('');
  const [accountNumberEndsWith, setAccountNumberEndsWith] = useState('');
  const [messageRegex, setMessageRegex] = useState<string>('');
  const [bankName, setBankName] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('Savings');

  // Load accounts from AsyncStorage when component mounts
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const storedAccounts = await AsyncStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (storedAccounts) {
        setAccounts(JSON.parse(storedAccounts));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load accounts');
      console.error('Error loading accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAccounts = async (updatedAccounts: Account[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(updatedAccounts));
    } catch (error) {
      Alert.alert('Error', 'Failed to save accounts');
      console.error('Error saving accounts:', error);
    }
  };

  const clearForm = () => {
    setSenderID('');
    setAccountNumberEndsWith('');
    setMessageRegex('');
    setBankName('');
    setAccountType('Savings');
    setEditingAccount(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!senderID || !accountNumberEndsWith || !messageRegex || !bankName) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const newAccount: Account = {
      id: editingAccount?.id || Date.now().toString(),
      senderID,
      accountNumberEndsWith,
      messageRegex: messageRegex.split(',').map(regex => regex.trim()),
      bankName,
      accountType,
    };

    let updatedAccounts: Account[];
    if (editingAccount) {
      updatedAccounts = accounts.map(acc =>
        acc.id === editingAccount.id ? newAccount : acc
      );
    } else {
      updatedAccounts = [...accounts, newAccount];
    }

    setAccounts(updatedAccounts);
    await saveAccounts(updatedAccounts);
    clearForm();
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setSenderID(account.senderID);
    setAccountNumberEndsWith(account.accountNumberEndsWith);
    setMessageRegex(account.messageRegex.join(', '));
    setBankName(account.bankName);
    setAccountType(account.accountType);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedAccounts = accounts.filter(acc => acc.id !== id);
            setAccounts(updatedAccounts);
            await saveAccounts(updatedAccounts);
          },
        },
      ]
    );
  };

  const renderAccountItem = ({ item }: { item: Account }) => (
    <View style={styles.accountItem}>
      <View style={styles.accountDetails}>
        <Text style={styles.bankName}>{item.bankName}</Text>
        <Text>Sender ID: {item.senderID}</Text>
        <Text>Account ends with: {item.accountNumberEndsWith}</Text>
        <Text>Type: {item.accountType}</Text>
        <Text>Regex patterns: {item.messageRegex.join(', ')}</Text>
      </View>
      <View style={styles.accountActions}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.title}>
        {editingAccount ? 'Edit Account' : 'Add New Account'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Sender ID"
        value={senderID}
        onChangeText={setSenderID}
      />

      <TextInput
        style={styles.input}
        placeholder="Account Number Ends With"
        value={accountNumberEndsWith}
        onChangeText={setAccountNumberEndsWith}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Message Regex (comma-separated)"
        value={messageRegex}
        onChangeText={setMessageRegex}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Bank Name"
        value={bankName}
        onChangeText={setBankName}
      />

      <View style={styles.pickerContainer}>
        <Text>Account Type:</Text>
        {(['Savings', 'Credit Card', 'Loan'] as AccountType[]).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeButton,
              accountType === type && styles.selectedTypeButton,
            ]}
            onPress={() => setAccountType(type)}
          >
            <Text style={[
              styles.typeButtonText,
              accountType === type && styles.selectedTypeButtonText,
            ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.formActions}>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>
            {editingAccount ? 'Update' : 'Add'} Account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={clearForm}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Accounts</Text>
        {!showForm && (
          <TouchableOpacity
            style={[styles.button, styles.addButton]}
            onPress={() => setShowForm(true)}
          >
            <Text style={styles.buttonText}>Add Account</Text>
          </TouchableOpacity>
        )}
      </View>

      {showForm && renderForm()}

      <FlatList
        data={accounts}
        renderItem={renderAccountItem}
        keyExtractor={item => item.id}
        style={styles.list}
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  pickerContainer: {
    marginBottom: 12,
  },
  typeButton: {
    padding: 8,
    borderRadius: 4,
    marginVertical: 4,
    backgroundColor: '#f0f0f0',
  },
  selectedTypeButton: {
    backgroundColor: '#007AFF',
  },
  typeButtonText: {
    color: '#333',
  },
  selectedTypeButtonText: {
    color: 'white',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 12,
    borderRadius: 4,
    minWidth: 100,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  editButton: {
    backgroundColor: '#007AFF',
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  accountItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  accountDetails: {
    marginBottom: 8,
  },
  bankName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  accountActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 24,
  },
});

export default AccountScreen;
