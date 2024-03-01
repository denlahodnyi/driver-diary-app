import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '~/shared/components';

export default function HeaderActivityEditBtn() {
  const navigation = useNavigation();

  return (
    <TouchableWithoutFeedback
      aria-label="Edit activity"
      onPress={() => {
        navigation.setParams({ mode: 'update' });
      }}
    >
      <Icon name="create" size={30} />
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({});
