import React, {useState} from 'react';
import {View, FlatList} from 'react-native';
import {useMessages} from '../../context/MessageContext';
import {Message} from '../../types';
import MessageItem from './message-item';

import styles from './styles';
import MonthSelector from '../../common/month-selector/month-selector';

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

  const handleMonthChange = (month: string) => {
    setCurrentMonth(month);
  };

  const handleClearMonth = () => {
    setCurrentMonth(null);
  };

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
