import React from 'react';
import {View, Text, Pressable} from 'react-native';
import styles from './styles';

type MonthSelectorProps = {
  currentMonth: string | null;
  onChange: (month: string) => void;
  onClear: () => void;
};

const MonthSelector = ({currentMonth, onChange, onClear}: MonthSelectorProps) => {
  const todaysMonth = new Date().toISOString().slice(0, 7);

  const handlePrevious = () => {
    if (!currentMonth) {
      return todaysMonth;
    }
    const [year, month] = currentMonth.split('-');
    let updatedMonth = parseInt(month, 10) - 1;
    let updatedYear = parseInt(year, 10);
    if (updatedMonth < 0) {
      updatedMonth = 11;
      updatedYear--;
    }
    const newDate = new Date(updatedYear, updatedMonth);
    onChange(newDate.toISOString().slice(0, 7));
  };

  const handleNext = () => {
    if (!currentMonth) {
      return todaysMonth;
    }
    const [year, month] = currentMonth.split('-');
    let updatedMonth = parseInt(month, 10) + 1;
    let updatedYear = parseInt(year, 10);
    if (updatedMonth === 12) {
      updatedMonth = 0;
      updatedYear++;
    }
    const newDate = new Date(updatedYear, updatedMonth);
    onChange(newDate.toISOString().slice(0, 7));
  };

  return (
    <View style={styles.monthSelectorWrapper}>
      <View style={styles.monthControlWrapper}>
        <Pressable style={{...styles.monthButton}} onPress={handlePrevious}>
          <Text style={{...styles.monthButtonText}}>{'<'}</Text>
        </Pressable>
        <Text style={styles.currentMonth}>
          {currentMonth
            ? new Date(currentMonth).toLocaleString('default', {month: 'long', year: 'numeric'})
            : 'All Transactions'}
        </Text>
        <Pressable style={styles.monthButton} onPress={handleNext}>
          <Text style={styles.monthButtonText}>{'>'} </Text>
        </Pressable>
      </View>
      {currentMonth && (
        <Pressable style={styles.clearButton} onPress={onClear}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </Pressable>
      )}
      {!currentMonth && (
        <Pressable style={styles.clearButton} onPress={() => onChange(todaysMonth)}>
          <Text style={styles.clearButtonText}>Today</Text>
        </Pressable>
      )}
    </View>
  );
};

export default MonthSelector;
