import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '~/shared/components';

export default function HeaderSettingsLink() {
  const navigation = useNavigation();

  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate('Settings')}>
      <Icon name="cog" size={30} />
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({});
