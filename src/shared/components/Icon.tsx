import type { IconProps as VectorIconProps } from 'react-native-vector-icons/Icon';
import IonIcon from 'react-native-vector-icons/Ionicons';

export type IconProps = VectorIconProps;

export default function Icon(props: IconProps) {
  return <IonIcon {...props} />;
}
