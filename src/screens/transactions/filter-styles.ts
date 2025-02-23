import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    minHeight: 56,
    maxHeight: 58,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 2,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    height: 40,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    color: '#333',
  },
  filterButtonTextActive: {
    color: '#FFF',
  },
});

export default styles;
