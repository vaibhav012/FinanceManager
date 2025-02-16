import React from 'react';
import {Text, TouchableOpacity, ScrollView} from 'react-native';
import styles from './styles';

export type GroupBy = 'category' | 'account' | 'month' | null;

const GroupFilters = ({onChange, groupBy}: {groupBy: GroupBy; onChange: (group: GroupBy) => void}) => (
  <ScrollView horizontal style={styles.filterContainer} showsHorizontalScrollIndicator={false}>
    <TouchableOpacity
      style={[styles.filterButton, !groupBy && styles.filterButtonActive]}
      onPress={() => {
        onChange(null);
      }}>
      <Text style={[styles.filterButtonText, !groupBy && styles.filterButtonTextActive]}>All</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.filterButton, groupBy === 'category' && styles.filterButtonActive]}
      onPress={() => {
        onChange('category');
      }}>
      <Text style={[styles.filterButtonText, groupBy === 'category' && styles.filterButtonTextActive]}>Category</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.filterButton, groupBy === 'account' && styles.filterButtonActive]}
      onPress={() => {
        onChange('account');
      }}>
      <Text style={[styles.filterButtonText, groupBy === 'account' && styles.filterButtonTextActive]}>Account</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.filterButton, groupBy === 'month' && styles.filterButtonActive]}
      onPress={() => {
        onChange('month');
      }}>
      <Text style={[styles.filterButtonText, groupBy === 'month' && styles.filterButtonTextActive]}>Month</Text>
    </TouchableOpacity>
  </ScrollView>
);

export default GroupFilters;
