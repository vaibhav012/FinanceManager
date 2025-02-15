import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TabBarIcon = ({ color, size, route}: any) => {
    let iconName;

    switch (route.name) {
      case 'Home':
        iconName = 'home';
        break;
      case 'Categories':
        iconName = 'shape';
        break;
      case 'Accounts':
        iconName = 'account-multiple';
        break;
      case 'Transactions':
        iconName = 'account-multiple';
        break;
      default:
        iconName = 'help';
    }

    return <Icon name={iconName} size={size} color={color} />;
  };

  export default TabBarIcon;
