import { TouchableOpacity } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { Icon } from '~/shared/components';

export default function HeaderVehiclesLink() {
  const navigation = useNavigation();
  const navigatorTheme = useTheme();

  return (
    <TouchableOpacity
      accessibilityLabel="Go to Vehicles screen"
      onPress={() => navigation.navigate('Vehicles')}
    >
      <Icon color={navigatorTheme.colors.text} name="car" size={30} />
    </TouchableOpacity>
  );
}
