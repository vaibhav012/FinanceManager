import React, { useState, useEffect } from "react";
import { 
  View, 
  FlatList, 
  Text, 
  TextInput, 
  Button, 
  Modal, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { Category, Transaction, Account } from "../types";
import { STORAGE_KEYS } from "../constants";

const TransactionsScreen = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await Promise.all([
      loadCategories(),
      loadTransactions(),
      loadAccounts(),
    ]);
  };

  const loadAccounts = async () => {
    try {
      const storedAccounts = await AsyncStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (storedAccounts) {
        setAccounts(JSON.parse(storedAccounts));
      }
    } catch (error) {
      console.error("Error loading accounts:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const storedCategories = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadTransactions = async () => {
    try {
      const storedTransactions = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
    }
  };

  const saveTransactions = async (updatedTransactions: Transaction[]) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.TRANSACTIONS,
        JSON.stringify(updatedTransactions)
      );
    } catch (error) {
      console.error("Error saving transactions:", error);
    }
  };

  const getAccountDetails = (accountId: string) => {
    console.log(accountId, accounts)
    return accounts.find(account => account.id === accountId);
  };

  const handleEdit = (transaction: Transaction) => {
    setCurrentTransaction({ ...transaction }); // Create a copy to avoid direct state mutation
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!currentTransaction) return;

    // Validate required fields
    if (!currentTransaction.amount || !currentTransaction.date || 
        !currentTransaction.time || !currentTransaction.type || 
        !currentTransaction.category || !currentTransaction.account) {
      Alert.alert("Please fill in all required fields");
      return;
    }

    const updatedTransactions = currentTransaction.id 
      ? transactions.map((t) => t.id === currentTransaction.id ? currentTransaction : t)
      : [...transactions, currentTransaction];

    setTransactions(updatedTransactions);
    await saveTransactions(updatedTransactions);
    setModalVisible(false);
    setCurrentTransaction(null);
  };

  const handleAddTransaction = () => {
    const now = new Date();
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount: null,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString(),
      type: null,
      purpose: null,
      category: null,
      account: null,
    };
    
    setCurrentTransaction(newTransaction);
    setModalVisible(true);
  };


// Modify the renderTransactionItem function to include a delete button
const renderTransactionItem = ({ item }: { item: Transaction }) => {
  const account = getAccountDetails(item.account || "");
  const category = categories.find(cat => cat.id === item.category);
  
  return (
    <View style={styles.transactionContainer}>
      <TouchableOpacity 
        onPress={() => handleEdit(item)} 
        style={styles.transactionItem}
      >
        <View style={styles.transactionHeader}>
          <Text style={styles.purposeText}>
            {item.purpose || "No Purpose"} - ₹{item.amount}
          </Text>
          <Text style={styles.accountText}>
            {account ? `${account.bankName} (${account.accountNumberEndsWith})` : "Unknown Account"}
          </Text>
        </View>
        <Text style={styles.detailsText}>
          {item.type} | {new Date(item.date || "").toLocaleDateString()} | {item.time}
        </Text>
        <Text style={styles.categoryText}>
          Category: {category?.name || "Uncategorized"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

  const renderTransactionForm = () => (
    <ScrollView style={styles.formScrollView}>
      <View style={styles.form}>
        <Text style={styles.label}>Amount *</Text>
        <TextInput
          placeholder="Enter amount"
          keyboardType="numeric"
          value={currentTransaction?.amount?.toString()}
          onChangeText={(text) =>
            setCurrentTransaction(prev => 
              prev ? { ...prev, amount: Number(text) || null } : null
            )
          }
          style={styles.input}
        />

        <Text style={styles.label}>Date *</Text>
        <TextInput
          value={currentTransaction?.date || ""}
          onChangeText={(text) =>
            setCurrentTransaction(prev =>
              prev ? { ...prev, date: text } : null
            )
          }
          placeholder="YYYY-MM-DD"
          style={styles.input}
        />

        <Text style={styles.label}>Time *</Text>
        <TextInput
          value={currentTransaction?.time || ""}
          onChangeText={(text) =>
            setCurrentTransaction(prev =>
              prev ? { ...prev, time: text } : null
            )
          }
          placeholder="HH:MM:SS"
          style={styles.input}
        />

        <Text style={styles.label}>Type * ({currentTransaction?.type})</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={currentTransaction?.type}
            onValueChange={(itemValue) =>
              setCurrentTransaction(prev =>
                prev ? { ...prev, type: itemValue } : null
              )
            }
            style={styles.picker}
          >
            <Picker.Item label="Select type" value={null} />
            <Picker.Item label="Credit" value="credit" />
            <Picker.Item label="Debit" value="debit" />
          </Picker>
        </View>

        <Text style={styles.label}>Purpose</Text>
        <TextInput
          placeholder="Enter purpose"
          value={currentTransaction?.purpose || ""}
          onChangeText={(text) =>
            setCurrentTransaction(prev =>
              prev ? { ...prev, purpose: text } : null
            )
          }
          style={styles.input}
        />

        <Text style={styles.label}>Account *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={currentTransaction?.account}
            onValueChange={(itemValue) =>
              setCurrentTransaction(prev =>
                prev ? { ...prev, accountId: itemValue } : null
              )
            }
            style={styles.picker}
          >
            <Picker.Item label="Select account" value={null} />
            {accounts.map((account) => (
              <Picker.Item 
                key={account.id} 
                label={`${account.bankName} (${account.accountNumberEndsWith})`} 
                value={account.id} 
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Category *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={currentTransaction?.category}
            onValueChange={(itemValue) =>
              setCurrentTransaction(prev =>
                prev ? { ...prev, category: itemValue } : null
              )
            }
            style={styles.picker}
          >
            <Picker.Item label="Select category" value={null} />
            {categories.map((cat) => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
            ))}
          </Picker>
        </View>
      </View>
    </ScrollView>
  );

  const handleDelete = (transactionId?: string) => {

    if(!transactionId) {return;}
    
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updatedTransactions = transactions.filter(t => t.id !== transactionId);
            setTransactions(updatedTransactions);
            await saveTransactions(updatedTransactions);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Button title="Add New Transaction" onPress={handleAddTransaction} />

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id || Date.now().toString()}
        renderItem={renderTransactionItem}
        style={styles.list}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {currentTransaction?.id ? "Edit Transaction" : "New Transaction"}
            </Text>
            
            {renderTransactionForm()}

            <View style={styles.modalButtons}>
              <Button title="Save" onPress={handleSave} />
              <Button
                title="Cancel"
                onPress={() => {
                  setModalVisible(false);
                  setCurrentTransaction(null);
                }}
                color="red"
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  list: {
    marginTop: 20,
  },
  // transactionItem: {
  //   padding: 15,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#E0E0E0',
  //   backgroundColor: '#FFFFFF',
  //   marginBottom: 8,
  //   borderRadius: 8,
  //   elevation: 2,
  // },
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
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
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
    color: '#000000'
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
});

export default TransactionsScreen;