import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  monthSelectorWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  monthControlWrapper: {
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthButton: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#666',
    fontSize: 12,
  },
});

export default styles;
