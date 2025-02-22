import React from 'react';
import {Pressable, Text, View} from 'react-native';
import commonStyles from './styles';

const Button = ({onPress, label, styles}: any) => {
  return (
    <Pressable onPress={onPress} style={{...commonStyles.buttonWrapper, ...styles}}>
      <View style={commonStyles.button}>
        <Text style={commonStyles.buttonText}>{label}</Text>
      </View>
    </Pressable>
  );
};

export default Button;
