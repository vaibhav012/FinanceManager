import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F8F8F8',
  },
  monthButton: {
    padding: 10,
  },
  monthButtonText: {
    fontSize: 20,
    color: '#007AFF',
  },
  currentMonth: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    marginLeft: 10,
    padding: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  clearButtonText: {
    color: '#666',
    fontSize: 12,
  },
});

export default styles;
