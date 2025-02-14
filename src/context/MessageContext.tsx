// context/MessageContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';
import { Message } from '../types';

interface MessageContextType {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  deleteMessage: (messageId: string) => Promise<void>;
  loadMessages: () => Promise<void>;
  addMessage: (message: Message) => Promise<void>;
  updateMessage: (messageId: string, updates: Partial<Message>) => Promise<void>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const loadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem(STORAGE_KEYS.MESSAGES);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const addMessage = async (message: Message) => {
    try {
      const currentMessages = await AsyncStorage.getItem('messages');
      const updatedMessages = JSON.parse(currentMessages || '[]');
      updatedMessages.push(message)
      setMessages(updatedMessages);
      await AsyncStorage.setItem(
        STORAGE_KEYS.MESSAGES,
        JSON.stringify(updatedMessages)
      );
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  const updateMessage = async (messageId: string, updates: Partial<Message>) => {
    try {
      const updatedMessages = messages.map(message => 
        message.id === messageId ? { ...message, ...updates } : message
      );
      setMessages(updatedMessages);
      await AsyncStorage.setItem(
        STORAGE_KEYS.MESSAGES,
        JSON.stringify(updatedMessages)
      );
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const updatedMessages = messages.filter(message => message.id !== messageId);
      setMessages(updatedMessages);
      await AsyncStorage.setItem(
        STORAGE_KEYS.MESSAGES,
        JSON.stringify(updatedMessages)
      );
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <MessageContext.Provider 
      value={{ 
        messages, 
        setMessages, 
        deleteMessage, 
        loadMessages,
        addMessage,
        updateMessage
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};