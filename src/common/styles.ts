import {StyleSheet, Dimensions} from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const commonStyles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  list: {
    marginTop: 20,
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
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default commonStyles;
