import {StyleSheet, Dimensions} from 'react-native';


const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  list: {
    marginTop: 20,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  purposeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  accountText: {
    fontSize: 14,
    color: '#666',
  },
  detailsText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  categoryText: {
    fontSize: 14,
    color: '#777',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    maxHeight: SCREEN_HEIGHT * 0.7, // 70% of screen height
  },
  formScrollView: {
    maxHeight: SCREEN_HEIGHT * 0.5, // 50% of screen height for the form
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    marginBottom: 15,
    padding: 8,
    backgroundColor: '#FFF',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    marginBottom: 15,
    backgroundColor: '#FFF',
  },
  picker: {
    marginTop: -8,
    marginBottom: -8,
    color: '#000000',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: '#FFF',
  },
  transactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionItem: {
    flex: 1,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 2,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    elevation: 2,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  remarksText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  remarksInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 8,
  },
  filterContainer: {
    flexDirection: 'column',
    marginBottom: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    height: 80,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
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
  groupItem: {
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  groupSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  selectedGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F8F8F8',
  },
  selectedGroupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#007AFF',
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
