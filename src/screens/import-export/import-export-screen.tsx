import React from 'react';
import {View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, Clipboard} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {storage, STORAGE_KEYS} from '../../utils/storage';
import {DUMMY_DATA} from '../../constants/dummy-data';
import type {STORAGE_KEY_VALUES} from '../../utils/storage';

const ImportExportScreen = () => {
  const exportData = async (format: 'json' | 'csv') => {
    try {
      // Gather all data from AsyncStorage
      const data = await Promise.all(
        Object.values(STORAGE_KEYS).map(async key => {
          const value = await storage.get(key);
          return {[key]: value};
        }),
      );

      const mergedData = Object.assign({}, ...data);
      let fileContent: string;
      let fileName: string;

      if (format === 'json') {
        fileContent = JSON.stringify(mergedData, null, 2);
        fileName = `finance_data_${new Date().toISOString()}.json`;
      } else {
        const csvData = Object.entries(mergedData)
          .map(([key, value]) => `${key},${JSON.stringify(value)}`)
          .join('\n');
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

  const copyToClipboard = async (format: 'json' | 'csv') => {
    try {
      // Gather all data from AsyncStorage
      const data = await Promise.all(
        Object.values(STORAGE_KEYS).map(async key => {
          const value = await storage.get(key);
          return {[key]: value};
        }),
      );

      const mergedData = Object.assign({}, ...data);
      let content: string;

      delete mergedData[STORAGE_KEYS.TRANSACTIONS];
      mergedData.messages = mergedData.messages?.slice(Math.max(mergedData.messages?.length - 5, 0)) ?? [];

      if (format === 'json') {
        content = JSON.stringify(mergedData, null, 2);
      } else {
        content = Object.entries(mergedData)
          .map(([key, value]) => `${key},${JSON.stringify(value)}`)
          .join('\n');
      }

      await Clipboard.setString(content);
      Alert.alert('Success', 'Data copied to clipboard!');
    } catch (error) {
      console.error('Copy error:', error);
      Alert.alert('Error', 'Failed to copy data');
    }
  };

  const importFromClipboard = async () => {
    try {
      const content = await Clipboard.getString();
      let data: Record<string, any>;

      // Try parsing as JSON first
      try {
        data = JSON.parse(content);
      } catch {
        // If JSON parsing fails, try CSV format
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
      }

      // Validate data structure
      const validKeys = Object.values(STORAGE_KEYS);
      const importedKeys = Object.keys(data);
      const invalidKeys = importedKeys.filter(key => !validKeys.includes(key));

      if (invalidKeys.length > 0) {
        throw new Error(`Invalid data structure. Unknown keys: ${invalidKeys.join(', ')}`);
      }

      // Store data
      await Promise.all(Object.entries(data).map(([key, value]) => storage.set(key as STORAGE_KEY_VALUES, value)));

      Alert.alert('Success', 'Data imported successfully from clipboard!');
    } catch (error) {
      console.error('Import error:', error);
      Alert.alert(
        'Error',
        'Failed to import data from clipboard. Make sure the copied data is in the correct format (JSON or CSV)',
      );
    }
  };

  const importData = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      const file = result[0];
      const content = await RNFS.readFile(file.uri, 'utf8');

      let data: Record<string, any>;
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
      await Promise.all(Object.entries(data).map(([key, value]) => storage.set(key as STORAGE_KEY_VALUES, value)));

      Alert.alert('Success', 'Data imported successfully!');
    } catch (error) {
      console.error('Import error:', error);
      Alert.alert('Error', 'Failed to import data');
    }
  };

  // Only for testing - overrides all data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const importDummyData = async () => {
    try {
      const promises = [];
      for (const [key, value] of Object.entries(DUMMY_DATA)) {
        promises.push(storage.set(key as STORAGE_KEYS, value));
      }
      await Promise.all(promises);
      Alert.alert('Success', 'Dummy data imported successfully!');
    } catch (error) {
      console.error('Import error:', error);
      Alert.alert('Error', 'Failed to import dummy data');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Export Data</Text>
        </View>
        <View style={styles.cardContent}>
          <TouchableOpacity style={styles.button} onPress={() => exportData('json')}>
            <Text style={styles.buttonText}>Export as JSON</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={() => exportData('csv')}>
            <Text style={[styles.buttonText, styles.buttonTextOutline]}>Export as CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.copyButton]} onPress={() => copyToClipboard('json')}>
            <Text style={styles.buttonText}>Copy as JSON</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Import Data</Text>
        </View>
        <View style={styles.cardContent}>
          <TouchableOpacity style={[styles.button, styles.importButton]} onPress={importData}>
            <Text style={styles.buttonText}>Select File to Import</Text>
          </TouchableOpacity>
          {/* Only enable when testing in dev mode */}
          {/* <TouchableOpacity style={[styles.button, styles.pasteButton]} onPress={importFromClipboard}>
            <Text style={styles.buttonText}>Import from Clipboard</Text>
          </TouchableOpacity> */}
          <Text style={styles.helperText}>Supported formats: JSON, CSV</Text>
        </View>
      </View>

      {/* Only enable when testing in dev mode */}
      {/* <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Caution: Only to test overrides all data</Text>
        </View>
        <View style={styles.cardContent}>
          <TouchableOpacity style={[styles.button, styles.importButton]} onPress={importDummyData}>
            <Text style={styles.buttonText}>Import Dummy Data</Text>
          </TouchableOpacity>
        </View>
      </View> */}
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
  copyButton: {
    backgroundColor: '#FF9800',
  },
  copyButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  copyButtonText: {
    color: '#FF9800',
  },
  pasteButton: {
    backgroundColor: '#2196F3',
  },
  helperText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ImportExportScreen;
