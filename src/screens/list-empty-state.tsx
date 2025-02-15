import React from 'react';
import {Text, StyleSheet} from 'react-native';

const ListEmptyComponent = () => <Text style={styles.emptyText}>No accounts added yet</Text>;

const styles = StyleSheet.create({
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 24,
  },
});

export default ListEmptyComponent;
