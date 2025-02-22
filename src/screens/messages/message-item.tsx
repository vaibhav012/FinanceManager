import React, {useState} from 'react';
import {View, Text, Pressable, Clipboard, Alert, TouchableOpacity} from 'react-native';
import {useMessages} from '../../context/MessageContext';
import {Message} from '../../types';

import styles from './styles';
import commonStyles from '../../common/styles';

const MessageItem = ({item}: {item: Message}) => {
  const {deleteMessage} = useMessages();
  const [isExpanded, setIsExpanded] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await Clipboard.setString(text);
      Alert.alert('Success', 'Message copied to clipboard', [{text: 'OK'}]);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy message', [{text: 'OK'}]);
    }
  };

  const handleDelete = (messageId: string) => {
    Alert.alert('Delete Message', 'Are you sure you want to delete this message?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => deleteMessage(messageId),
        style: 'destructive',
      },
    ]);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.messageWrapper}>
      <Pressable
        onLongPress={() => copyToClipboard(item.body)}
        style={({pressed}) => [commonStyles.card, pressed && commonStyles.cardPressed]}>
        <Text style={styles.sender}>{item.sender}</Text>
        <View>
          <Text style={styles.body} numberOfLines={isExpanded ? undefined : 1}>
            {item.body}
          </Text>
        </View>
        <View style={styles.messageItemFooter}>
          <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleDateString()}</Text>
          {item.body.length > 50 && (
            <TouchableOpacity onPress={toggleExpand} style={styles.showMoreButton}>
              <Text style={styles.showMoreText}>{isExpanded ? 'Show less' : 'Show more'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </Pressable>
      <TouchableOpacity style={commonStyles.deleteButton} onPress={() => handleDelete(item.id)}>
        <Text style={commonStyles.deleteButtonText}>x</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MessageItem;
