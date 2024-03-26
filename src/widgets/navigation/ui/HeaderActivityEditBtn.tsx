import { TouchableOpacity } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { Icon } from '~/shared/components';

export default function HeaderActivityEditBtn() {
  const navigation = useNavigation();
  const navigatorTheme = useTheme();

  return (
    <TouchableOpacity
      aria-label="Edit activity"
      onPress={() => {
        navigation.setParams({ mode: 'update' });
      }}
    >
      <Icon color={navigatorTheme.colors.text} name="create" size={30} />
    </TouchableOpacity>
  );
}
