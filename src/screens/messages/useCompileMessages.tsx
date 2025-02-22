import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMessages} from '../../context/MessageContext';
import {Message} from '../../types';
import {STORAGE_KEYS} from '../../utils/storage';
import {compileMessages} from '../../utils/message';
import {updateTransactionSafely} from '../../utils/transactions';
import {useEffect} from 'react';

export const useCompileMessages = () => {
  const {messages} = useMessages();

  const compileMessagesNow = async (refreshedMessages: Message[]) => {
    const storedAccounts = await AsyncStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    const compiledTransactions = compileMessages(refreshedMessages, JSON.parse(storedAccounts ?? '[]'));
    const existingTransactions = (await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) ?? '[]';
    const mergedTransactions = updateTransactionSafely(compiledTransactions, JSON.parse(existingTransactions));
    await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(mergedTransactions));
  };

  useEffect(() => {
    compileMessagesNow(messages);
  }, [messages]);
};
