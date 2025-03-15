import React, {useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Category} from '../types';
import TransactionsCount from './transactions-count';
import {STORAGE_KEYS} from '../utils/storage';
import styles from './categories-styles';
import Button from '../common/Button';
import commonStyles from '../common/styles';
import {useFocusEffect} from '@react-navigation/native';

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
    <TouchableOpacity
      style={{...commonStyles.card, ...styles.categoryCard}}
      onLongPress={() => handleEditCategory(item)}>
      <View style={[styles.iconContainer, {backgroundColor: item.color}]}>
        <Icon name={item.icon} size={20} color="white" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.messageCount}>
        <TransactionsCount name={item.name} />
      </Text>
      <View style={styles.categoryActionsWrapper}>
        <Button label="Edit" onPress={() => handleEditCategory(item)} />
        <Button label="Delete" onPress={() => handleDeleteCategory(item)} />
      </View>
    </TouchableOpacity>
  );

  useFocusEffect(() => {
    loadCategories();
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button label="New" onPress={handleAddCategory} />

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

export default CategoriesScreen;
