import {StyleSheet, Dimensions} from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const commonStyles = StyleSheet.create({
  marginZero: {
    margin: 0,
  },
  paddingZero: {
    padding: 0,
  },
  buttonWrapper: {padding: 8},
  button: {
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    height: 36,
    minWidth: 50,
    paddingHorizontal: 8,
    width: 'auto',
  },
  buttonText: {color: 'white'},

  deleteButton: {
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 36, // Fixed width
    height: 36, // Fixed height to make it square
    marginLeft: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },

  card: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardPressed: {
    opacity: 0.7,
  },
});

export default commonStyles;
