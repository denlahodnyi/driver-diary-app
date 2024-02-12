import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '~/shared/components';

export default function HeaderSettingsLink() {
  const navigation = useNavigation();

  return (
    <TouchableWithoutFeedback
      accessibilityLabel="Go to new vehicle screen"
      onPress={() => navigation.navigate('Vehicle')}
    >
      <Icon name="add" size={30} />
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({});
