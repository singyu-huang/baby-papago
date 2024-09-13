import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

interface LocationButtonProps {
  onPress: () => void;
}

const LocationButton: React.FC<LocationButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.locationButton} onPress={onPress}>
      <Icon name="my-location" style={styles.locationIcon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  locationButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
  locationIcon: {
    color: '#3E4958',
    fontSize: 30,
  },
});

export default LocationButton;