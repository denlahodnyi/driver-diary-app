import { TouchableOpacity } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { Icon } from '~/shared/components';

export default function HeaderSettingsLink() {
  const navigation = useNavigation();
  const navigatorTheme = useTheme();

  return (
    <TouchableOpacity
      accessibilityLabel="Go to Settings screen"
      onPress={() => navigation.navigate('Settings')}
    >
      <Icon
        color={navigatorTheme.colors.text}
        name="settings-sharp"
        size={30}
      />
    </TouchableOpacity>
  );
}
