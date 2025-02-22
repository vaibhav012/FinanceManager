import React from 'react';
import {Text, Pressable, ScrollView} from 'react-native';
import styles from './filter-styles';

export type GroupBy = 'category' | 'account' | 'month' | null;

const GroupFilters = ({onChange, groupBy}: {groupBy: GroupBy; onChange: (group: GroupBy) => void}) => (
  <ScrollView horizontal style={styles.filterContainer} showsHorizontalScrollIndicator={false}>
    <Pressable
      style={[styles.filterButton, !groupBy && styles.filterButtonActive]}
      onPress={() => {
        onChange(null);
      }}>
      <Text style={[styles.filterButtonText, !groupBy && styles.filterButtonTextActive]}>All</Text>
    </Pressable>
    <Pressable
      style={[styles.filterButton, groupBy === 'category' && styles.filterButtonActive]}
      onPress={() => {
        onChange('category');
      }}>
      <Text style={[styles.filterButtonText, groupBy === 'category' && styles.filterButtonTextActive]}>Category</Text>
    </Pressable>
    <Pressable
      style={[styles.filterButton, groupBy === 'account' && styles.filterButtonActive]}
      onPress={() => {
        onChange('account');
      }}>
      <Text style={[styles.filterButtonText, groupBy === 'account' && styles.filterButtonTextActive]}>Account</Text>
    </Pressable>
    <Pressable
      style={[styles.filterButton, groupBy === 'month' && styles.filterButtonActive]}
      onPress={() => {
        onChange('month');
      }}>
      <Text style={[styles.filterButtonText, groupBy === 'month' && styles.filterButtonTextActive]}>Month</Text>
    </Pressable>
  </ScrollView>
);

export default GroupFilters;
