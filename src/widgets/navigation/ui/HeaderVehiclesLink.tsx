import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '~/shared/components';

export default function HeaderVehiclesLink() {
  const navigation = useNavigation();

  return (
    <TouchableWithoutFeedback
      accessibilityLabel="Go to Vehicles screen"
      onPress={() => navigation.navigate('Vehicles')}
    >
      <Icon name="car" size={30} />
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({});
