import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, FlatList, Alert, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Account, AccountType} from '../types';
import ListEmptyComponent from './list-empty-state';
import {STORAGE_KEYS} from '../utils/storage';
import Button from '../common/Button';
import styles from './accounts-styles';
import commonStyles from '../common/styles';
import {useFocusEffect} from '@react-navigation/native';

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
  useFocusEffect(() => {
    loadAccounts();
  });

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
      messageRegex: [messageRegex],
      bankName,
      accountType,
    };

    let updatedAccounts: Account[];
    if (editingAccount) {
      updatedAccounts = accounts.map(acc => (acc.id === editingAccount.id ? newAccount : acc));
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
    setMessageRegex(account.messageRegex?.[0]);
    setBankName(account.bankName);
    setAccountType(account.accountType);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this account?', [
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
    ]);
  };

  const renderAccountItem = ({item}: {item: Account}) => (
    <View style={{...commonStyles.card, ...styles.accountsCard}}>
      <View style={styles.accountDetails}>
        <Text style={styles.bankName}>{item.bankName}</Text>
        <Text>Sender ID: {item.senderID}</Text>
        <Text>Account ends with: {item.accountNumberEndsWith}</Text>
        <Text>Type: {item.accountType}</Text>
        <Text>Regex patterns: {item.messageRegex?.[0]}</Text>
      </View>
      <View style={styles.accountActions}>
        <Button label="Edit" onPress={() => handleEdit(item)} />
        <Button label="Delete" onPress={() => handleDelete(item.id)} />
      </View>
    </View>
  );

  const renderForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.title}>{editingAccount ? 'Edit Account' : 'Add New Account'}</Text>

      <TextInput style={styles.input} placeholder="Sender ID" value={senderID} onChangeText={setSenderID} />

      <TextInput
        style={styles.input}
        placeholder="Account Number Ends With"
        value={accountNumberEndsWith}
        onChangeText={setAccountNumberEndsWith}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Message Regex"
        value={messageRegex}
        onChangeText={setMessageRegex}
        multiline
      />

      <TextInput style={styles.input} placeholder="Bank Name" value={bankName} onChangeText={setBankName} />

      <View style={styles.pickerContainer}>
        <Text>Account Type:</Text>
        {(['Savings', 'Credit Card', 'Loan'] as AccountType[]).map(type => (
          <TouchableOpacity
            key={type}
            style={[styles.typeButton, accountType === type && styles.selectedTypeButton]}
            onPress={() => setAccountType(type)}>
            <Text style={[styles.typeButtonText, accountType === type && styles.selectedTypeButtonText]}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.formActions}>
        <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{editingAccount ? 'Update' : 'Add'} Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={clearForm}>
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
      <View style={styles.header}>{!showForm && <Button label="New" onPress={() => setShowForm(true)} />}</View>

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

export default AccountScreen;
