import {
  type StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  type ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '~/shared/components';
import { toArray } from '~/shared/utils';

type ToolbarProps = {
  containerStyle?: StyleProp<ViewStyle>;
};

function Toolbar(props: ToolbarProps) {
  const { containerStyle } = props;
  const navigation = useNavigation();

  const handleAddActivity = () => {
    navigation.navigate('Categories', { mode: 'create' });
  };

  return (
    <View style={[styles.container, ...toArray(containerStyle)]}>
      <TouchableWithoutFeedback onPress={handleAddActivity}>
        <Icon name="add" size={25} />
      </TouchableWithoutFeedback>
    </View>
  );
}

export default Toolbar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
