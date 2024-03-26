import { type TextInputProps } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import {
  inputBaseContainer,
  inputBaseError,
  inputBaseInput,
  inputBaseInputWrapper,
  inputBaseLabel,
} from '~/app/styles';
import { toArray } from '~/shared/utils';
import HeadlessInput, { type HeadlessInputProps } from './HeadlessInput';
import useFocusedInput from './useFocusedInput';

export type InputProps<T extends object = TextInputProps> =
  HeadlessInputProps<T>;

export default function Input<T extends TextInputProps = TextInputProps>(
  props: InputProps<T>,
) {
  const focused = useFocusedInput();
  const { theme } = useStyles();

  return (
    <HeadlessInput
      {...props}
      containerProps={{
        style: [inputBaseContainer, ...toArray(props.containerProps?.style)],
      }}
      errorProps={{
        style: [inputBaseError(theme), ...toArray(props.errorProps?.style)],
      }}
      inputWrapperProps={{
        style: [
          inputBaseInputWrapper(theme),
          focused.inputStyle,
          ...toArray(props.inputWrapperProps?.style),
        ],
      }}
      labelProps={{
        style: [inputBaseLabel(), ...toArray(props.labelProps?.style)],
      }}
      style={[inputBaseInput(theme), ...toArray(props?.style)]}
      {...focused.props}
    />
  );
}
