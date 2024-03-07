import {
  Modal,
  type ModalProps,
  type StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import { toArray } from '~/shared/utils';

type ModalkaProps = ModalProps & {
  backdropStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  contentViewProps?: ViewProps;
  onClose: () => void;
};

export default function Modalka(props: ModalkaProps) {
  const {
    backdropStyle,
    children,
    containerStyle,
    contentStyle,
    contentViewProps,
    onClose,
    ...rest
  } = props;

  return (
    <Modal transparent animationType="fade" onRequestClose={onClose} {...rest}>
      <View style={[styles.container, ...toArray(containerStyle)]}>
        <TouchableWithoutFeedback accessible={false} onPress={onClose}>
          <View style={[styles.backdrop, ...toArray(backdropStyle)]} />
        </TouchableWithoutFeedback>
        <View
          style={[styles.content, ...toArray(contentStyle)]}
          {...contentViewProps}
        >
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
  },
  content: {
    backgroundColor: '#FFF',
    borderRadius: 6,
    elevation: 5,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 2,
  },
});
