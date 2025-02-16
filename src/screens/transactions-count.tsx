import React, {useEffect, useState} from 'react';
import {Transaction} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '../constants';

const TransactionsCount = ({name = ''}) => {
  const [count, setCount] = useState('-');

  const getTransactionCountByCategory = async (category: string) => {
    const existingTransactions = (await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) ?? '[]';
    const parsed: Transaction[] = JSON.parse(existingTransactions);

    return parsed.filter(msg => msg.category === category).length;
  };

  const getCount = async () => {
    const newCount = await getTransactionCountByCategory(name);
    setCount(newCount.toString());
  };

  useEffect(() => {
    getCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{count + 'messages'}</>;
};

export default TransactionsCount;
