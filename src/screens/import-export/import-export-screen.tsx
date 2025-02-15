// src/screens/ImportExportScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import { STORAGE_KEYS } from '../../constants';
import { storage } from '../../utils/storage';

const ImportExportScreen = () => {
  const exportData = async (format: 'json' | 'csv') => {
    try {
      // Gather all data from AsyncStorage
      const data = await Promise.all(
        Object.keys(STORAGE_KEYS).map(async (key) => {
          const value = await storage.get(key as keyof typeof STORAGE_KEYS);
          return { [key]: value };
        })
      );

      const mergedData = Object.assign({}, ...data);
      let fileContent: string;
      let fileName: string;

      if (format === 'json') {
        fileContent = JSON.stringify(mergedData, null, 2);
        fileName = `finance_data_${new Date().toISOString()}.json`;
      } else {
        const csvData = Object.entries(mergedData).map(([key, value]) =>
          `${key},${JSON.stringify(value)}`
        ).join('\n');
        fileContent = csvData;
        fileName = `finance_data_${new Date().toISOString()}.csv`;
      }

      const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      await RNFS.writeFile(path, fileContent, 'utf8');

      Alert.alert('Success', 'Data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const importData = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      const file = result[0];
      const content = await RNFS.readFile(file.uri, 'utf8');

      let data: Record<string ,any>;
      if (file.name?.endsWith('.json')) {
        data = JSON.parse(content);
      } else if (file.name?.endsWith('.csv')) {
        const rows = content.split('\n');
        data = {};
        for (const row of rows) {
          const [key, value] = row.split(',');
          try {
            data[key] = JSON.parse(value);
          } catch (e) {
            data[key] = value;
          }
        }
      } else {
        throw new Error('Unsupported file format');
      }

      // Validate data structure
      const validKeys = Object.keys(STORAGE_KEYS);
      const importedKeys = Object.keys(data);
      const invalidKeys = importedKeys.filter(key => !validKeys.includes(key));

      if (invalidKeys.length > 0) {
        throw new Error(`Invalid data structure. Unknown keys: ${invalidKeys.join(', ')}`);
      }

      // Store data
      await Promise.all(
        Object.entries(data).map(([key, value]) =>
          storage.set(key as keyof typeof STORAGE_KEYS, value)
        )
      );

      Alert.alert('Success', 'Data imported successfully!');
    } catch (error) {
      console.error('Import error:', error);
      Alert.alert('Error', 'Failed to import data');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Export Data</Text>
        </View>
        <View style={styles.cardContent}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => exportData('json')}>
            <Text style={styles.buttonText}>Export as JSON</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonOutline]}
            onPress={() => exportData('csv')}>
            <Text style={[styles.buttonText, styles.buttonTextOutline]}>
              Export as CSV
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Import Data</Text>
        </View>
        <View style={styles.cardContent}>
          <TouchableOpacity
            style={[styles.button, styles.importButton]}
            onPress={importData}>
            <Text style={styles.buttonText}>Select File to Import</Text>
          </TouchableOpacity>
          <Text style={styles.helperText}>
            Supported formats: JSON, CSV
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardContent: {
    padding: 16,
  },
  button: {
    backgroundColor: '#6200ea',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6200ea',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonTextOutline: {
    color: '#6200ea',
  },
  importButton: {
    backgroundColor: '#4CAF50',
  },
  helperText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ImportExportScreen;
