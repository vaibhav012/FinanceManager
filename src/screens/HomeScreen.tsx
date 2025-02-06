import React, {useEffect} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {useMessages} from '../context/MessageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {compileMessages} from '../utils/message';
import { STORAGE_KEYS } from '../constants';
import { Message } from '../types';
import { updateTransactionSafely } from '../utils/transactions';

const HomeScreen = () => {
  const {messages} = useMessages();

  const renderItem = ({item}: {item: Message}) => (
    <View style={styles.messageCard}>
      <Text style={styles.sender}>{item.sender}</Text>
      <Text style={styles.body}>{item.body}</Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleDateString()}
      </Text>
    </View>
  );


  const compileMessagesNow = async () => {
    // Iterate through messages
    // Match sender id from accounts, if not matched, continue to next message
    // Match regex and identify - Amount, date, time, credit/debit, purpose (sender), category
    // set above identified items into transactions, link the transaction with appropriate account id
    const storedAccounts = await AsyncStorage.getItem(STORAGE_KEYS.ACCOUNTS);

    const compiledTransactions = compileMessages(
      messages,
      JSON.parse(storedAccounts ?? '[]'),
    );

    const existingTransactions = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS) ?? '[]';

    const mergedTransactions = updateTransactionSafely(compiledTransactions, JSON.parse(existingTransactions));

    await AsyncStorage.setItem(
      STORAGE_KEYS.TRANSACTIONS,
      JSON.stringify(mergedTransactions),
    );
  };

  useEffect(() => {
    compileMessagesNow();
  }, [messages]);

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  messageCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sender: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
});

export default HomeScreen;
