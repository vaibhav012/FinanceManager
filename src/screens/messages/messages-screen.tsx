import React, {useEffect, useState} from 'react';
import {View, FlatList} from 'react-native';
import {useMessages} from '../../context/MessageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {compileMessages} from '../../utils/message';
import {Message} from '../../types';
import {updateTransactionSafely} from '../../utils/transactions';
import MessageItem from './message-item';

import styles from './styles';
import MonthSelector from '../../common/month-selector/month-selector';
import {STORAGE_KEYS} from '../../utils/storage';

const MessagesScreen = () => {
  const {messages} = useMessages();

  const [currentMonth, setCurrentMonth] = useState<string | null>(
    new Date().toISOString().slice(0, 7), // Format: "YYYY-MM"
  );

  const filterMessagesByMonth = (msgs: Message[]) => {
    // Return all messages if no month filter
    if (!currentMonth) {
      return msgs;
    }

    return messages.filter(message => {
      const messageDate = new Date(message.timestamp);
      const messageMonth = `${messageDate.getFullYear()}-${String(messageDate.getMonth() + 1).padStart(2, '0')}`;
      return messageMonth === currentMonth;
    });
  };

  const compileMessagesNow = async (refreshedMessages: Message[]) => {
    const storedAccounts = await AsyncStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    const compiledTransactions = compileMessages(refreshedMessages, JSON.parse(storedAccounts ?? '[]'));
    const existingTransactions = (await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) ?? '[]';
    const mergedTransactions = updateTransactionSafely(compiledTransactions, JSON.parse(existingTransactions));
    await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(mergedTransactions));
  };

  const handleMonthChange = (month: string) => {
    setCurrentMonth(month);
  };

  const handleClearMonth = () => {
    setCurrentMonth(null);
  };

  useEffect(() => {
    compileMessagesNow(messages);
  }, [messages]);

  const filteredMessages = filterMessagesByMonth(messages);

  const sortedMessages = filteredMessages.sort((a, b) => b.timestamp - a.timestamp);

  return (
    <View style={styles.container}>
      {<MonthSelector currentMonth={currentMonth} onChange={handleMonthChange} onClear={handleClearMonth} />}
      <FlatList
        data={sortedMessages}
        renderItem={({item}: {item: Message}) => <MessageItem item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default MessagesScreen;
