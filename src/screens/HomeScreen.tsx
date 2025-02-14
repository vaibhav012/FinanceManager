import React, {useEffect} from 'react';
import {
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Pressable, 
  Clipboard,
  Alert,
  TouchableOpacity
} from 'react-native';
import {useMessages} from '../context/MessageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {compileMessages} from '../utils/message';
import { STORAGE_KEYS } from '../constants';
import { Message } from '../types';
import { updateTransactionSafely } from '../utils/transactions';

const HomeScreen = () => {
  const {messages, deleteMessage} = useMessages();

  const copyToClipboard = async (text: string) => {
    try {
      await Clipboard.setString(text);
      Alert.alert(
        "Success",
        "Message copied to clipboard",
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to copy message",
        [{ text: "OK" }]
      );
    }
  };

  const handleDelete = (messageId: string) => {
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => deleteMessage(messageId),
          style: "destructive"
        }
      ]
    );
  };

  const renderItem = ({item}: {item: Message}) => (
    <View style={styles.messageWrapper}>
      <Pressable 
        onLongPress={() => copyToClipboard(item.body)}
        style={({pressed}) => [
          styles.messageCard,
          pressed && styles.messageCardPressed
        ]}
      >
        <Text style={styles.sender}>{item.sender}</Text>
        <Text style={styles.body}>{item.body}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </Pressable>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const compileMessagesNow = async () => {
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
  messageWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Changed from 'center' to align with top of card
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 44, // Fixed width
    height: 44, // Fixed height to make it square
    marginLeft: 10,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12, // Smaller font size
    fontWeight: 'bold',
  },
  messageCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  messageCardPressed: {
    opacity: 0.7,
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