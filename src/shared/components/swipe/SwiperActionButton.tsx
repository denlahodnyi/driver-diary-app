import { TouchableOpacity, type TouchableOpacityProps } from 'react-native';
import Icon from '../Icon';

type SwiperActionButtonProps = {
  iconName: string;
} & TouchableOpacityProps;

type SwiperActionButton = {
  Props: SwiperActionButtonProps;
};

function SwiperActionButton(props: SwiperActionButtonProps) {
  const { iconName, ...rest } = props;

  return (
    <TouchableOpacity {...rest}>
      <Icon color="#FFF" name={iconName} size={40} />
    </TouchableOpacity>
  );
}

export default SwiperActionButton;
