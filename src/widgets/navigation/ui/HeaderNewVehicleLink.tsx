import { TouchableOpacity } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { Icon } from '~/shared/components';

export default function HeaderSettingsLink() {
  const navigation = useNavigation();
  const navigatorTheme = useTheme();

  return (
    <TouchableOpacity
      accessibilityLabel="Go to new vehicle screen"
      onPress={() => navigation.navigate('Vehicle')}
    >
      <Icon color={navigatorTheme.colors.text} name="add" size={30} />
    </TouchableOpacity>
  );
}
