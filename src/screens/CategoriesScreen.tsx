import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Category} from '../types';
import {STORAGE_KEYS} from '../constants';
import TransactionsCount from './transactions-count';

const DEFAULT_CATEGORIES: Category[] = [
  {id: '1', name: 'Bills', icon: 'receipt', color: '#FF6B6B'},
  {id: '2', name: 'Shopping', icon: 'cart', color: '#4ECDC4'},
  {id: '3', name: 'Transfer', icon: 'bank-transfer', color: '#45B7D1'},
  {id: '4', name: 'Food', icon: 'food', color: '#96CEB4'},
  {id: '5', name: 'Others', icon: 'dots-horizontal', color: '#FFEEAD'},
];

const AVAILABLE_ICONS = [
  'receipt',
  'cart',
  'bank-transfer',
  'food',
  'dots-horizontal',
  'cash',
  'credit-card',
  'gift',
  'car',
  'home',
  'train',
  'airplane',
  'medical-bag',
  'school',
  'phone',
];

const CategoriesScreen = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('receipt');
  const [color, setColor] = useState('#FF6B6B');

  const loadCategories = async () => {
    try {
      const storedCategories = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (!storedCategories) {
        // If no categories exist, set and save defaults
        await saveCategories(DEFAULT_CATEGORIES);
        setCategories(DEFAULT_CATEGORIES);
      } else {
        setCategories(JSON.parse(storedCategories));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const saveCategories = async (updatedCategories: Category[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updatedCategories));
    } catch (error) {
      Alert.alert('Error', 'Failed to save categories');
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setName('');
    setSelectedIcon('receipt');
    setColor('#FF6B6B');
    setModalVisible(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setSelectedIcon(category.icon);
    setColor(category.color);
    setModalVisible(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeleteCategory = (category: Category) => {
    Alert.alert('Delete Category', 'Are you sure you want to delete this category?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updatedCategories = categories.filter(c => c.id !== category.id);
          setCategories(updatedCategories);
          await saveCategories(updatedCategories);
        },
      },
    ]);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    const newCategory: Category = {
      id: editingCategory?.id || Date.now().toString(),
      name: name.trim(),
      icon: selectedIcon,
      color: color,
    };

    let updatedCategories: Category[];
    if (editingCategory) {
      updatedCategories = categories.map(cat => (cat.id === editingCategory.id ? newCategory : cat));
    } else {
      updatedCategories = [...categories, newCategory];
    }

    setCategories(updatedCategories);
    await saveCategories(updatedCategories);
    setModalVisible(false);
  };

  const renderCategoryItem = ({item}: {item: Category}) => (
    <TouchableOpacity style={styles.categoryCard} onLongPress={() => handleEditCategory(item)}>
      <View style={[styles.iconContainer, {backgroundColor: item.color}]}>
        <Icon name={item.icon} size={30} color="white" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.messageCount}>
        <TransactionsCount name={item.name} />
      </Text>
      <TouchableOpacity style={styles.editButton} onPress={() => handleEditCategory(item)}>
        <Icon name="lead-pencil" size={20} color="#666" />
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteCategory(item)}
      >
        <Icon name="delete" size={20} color="#666" />
      </TouchableOpacity> */}
    </TouchableOpacity>
  );

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
        <Icon name="plus" size={24} color="white" />
        <Text style={styles.addButtonText}>Add Category</Text>
      </TouchableOpacity>

      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingCategory ? 'Edit Category' : 'Add Category'}</Text>

            <TextInput style={styles.input} placeholder="Category Name" value={name} onChangeText={setName} />

            <Text style={styles.label}>Select Icon</Text>
            <FlatList
              data={AVAILABLE_ICONS}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({item: icon}) => (
                <TouchableOpacity
                  style={[styles.iconOption, selectedIcon === icon && styles.selectedIcon]}
                  onPress={() => setSelectedIcon(icon)}>
                  <Icon name={icon} size={24} color={selectedIcon === icon ? 'white' : '#666'} />
                </TouchableOpacity>
              )}
              keyExtractor={icon => icon}
            />

            <Text style={styles.label}>Select Color</Text>
            <View style={styles.colorContainer}>
              {['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'].map(colorOption => (
                <TouchableOpacity
                  key={colorOption}
                  style={[
                    styles.colorOption,
                    {backgroundColor: colorOption},
                    color === colorOption && styles.selectedColor,
                  ]}
                  onPress={() => setColor(colorOption)}
                />
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 10,
  },
  categoryCard: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  messageCount: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  editButton: {
    position: 'absolute',
    top: 8,
    right: 36,
    padding: 4,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 16,
  },
  selectedIcon: {
    backgroundColor: '#007AFF',
  },
  colorContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 8,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CategoriesScreen;
