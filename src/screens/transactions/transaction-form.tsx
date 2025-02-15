import React, {Dispatch, SetStateAction, useState} from 'react';
import {View, Text, TextInput, ScrollView, Alert} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Category, Transaction, Account} from '../../types';
import styles from './styles';

const TransactionForm = ({
  currentTransaction,
  onUpdateTransaction,
  accounts,
  categories,
}: {
  currentTransaction: Transaction;
  onUpdateTransaction: Dispatch<SetStateAction<Transaction | null>>;
  accounts: Account[];
  categories: Category[];
}) => {
  const [amountText, setAmountText] = useState(currentTransaction?.amount?.toString() ?? '');

  return (
    <ScrollView style={styles.formScrollView}>
      <View style={styles.form}>
        <Text style={styles.label}>Amount *</Text>
        <TextInput
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amountText}
          onChangeText={text => {
            // Allow any number or single decimal point format
            setAmountText(text);

            if (/^\d*\.?\d{0,2}$/.test(text)) {
              const amount = text === '' ? null : text.endsWith('.') ? parseFloat(text + '00') : parseFloat(text);
              onUpdateTransaction(prev => (prev ? {...prev, amount} : null));
            }
          }}
          style={styles.input}
        />

        <Text style={styles.label}>Date *</Text>
        <TextInput
          value={currentTransaction?.date || ''}
          onChangeText={text => onUpdateTransaction(prev => (prev ? {...prev, date: text} : null))}
          placeholder="YYYY-MM-DD"
          style={styles.input}
        />

        <Text style={styles.label}>Time *</Text>
        <TextInput
          value={currentTransaction?.time || ''}
          onChangeText={text => onUpdateTransaction(prev => (prev ? {...prev, time: text} : null))}
          placeholder="HH:MM:SS"
          style={styles.input}
        />

        <Text style={styles.label}>Type * ({currentTransaction?.type})</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={currentTransaction?.type}
            onValueChange={itemValue => onUpdateTransaction(prev => (prev ? {...prev, type: itemValue} : null))}
            style={styles.picker}>
            <Picker.Item label="Select type" value={null} />
            <Picker.Item label="Credit" value="credit" />
            <Picker.Item label="Debit" value="debit" />
          </Picker>
        </View>

        <Text style={styles.label}>Purpose</Text>
        <TextInput
          placeholder="Enter purpose"
          value={currentTransaction?.purpose || ''}
          onChangeText={text => onUpdateTransaction(prev => (prev ? {...prev, purpose: text} : null))}
          style={styles.input}
        />

        <Text style={styles.label}>Account *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={currentTransaction?.account}
            onValueChange={itemValue => onUpdateTransaction(prev => (prev ? {...prev, account: itemValue} : null))}
            style={styles.picker}>
            <Picker.Item label="Select account" value={null} />
            {accounts.map(account => (
              <Picker.Item
                key={account.id}
                label={`${account.bankName} (${account.accountNumberEndsWith})`}
                value={account.id}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Category *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={currentTransaction?.category}
            onValueChange={itemValue => onUpdateTransaction(prev => (prev ? {...prev, category: itemValue} : null))}
            style={styles.picker}>
            <Picker.Item label="Select category" value={null} />
            {categories.map(cat => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Remarks</Text>
        <TextInput
          placeholder="Add remarks (optional)"
          value={currentTransaction?.remarks || ''}
          onChangeText={text => onUpdateTransaction(prev => (prev ? {...prev, remarks: text} : null))}
          style={[styles.input, styles.remarksInput]}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>
    </ScrollView>
  );
};

export default TransactionForm;
