import { type TextInputProps } from 'react-native';
import {
  inputBaseContainer,
  inputBaseError,
  inputBaseInput,
  inputBaseInputWrapper,
  inputBaseLabel,
} from '~/app/styles';
import { toArray } from '~/shared/utils';
import HeadlessInput, { type HeadlessInputProps } from './HeadlessInput';

export type InputProps<T extends object = TextInputProps> =
  HeadlessInputProps<T>;

// Modify TextInputProps to make it more flexible for TextInput-like components
type TextILikeProps = Omit<TextInputProps, 'onChangeText'> & {
  onChangeText?: (value: string, ...rest: any[]) => void;
};

export default function Input<T extends TextILikeProps = TextInputProps>(
  props: InputProps<T>,
) {
  return (
    <HeadlessInput
      {...props}
      containerProps={{
        style: [inputBaseContainer, ...toArray(props.containerProps?.style)],
      }}
      errorProps={{
        style: [inputBaseError, ...toArray(props.errorProps?.style)],
      }}
      inputWrapperProps={{
        style: [
          inputBaseInputWrapper,
          ...toArray(props.inputWrapperProps?.style),
        ],
      }}
      labelProps={{
        style: [inputBaseLabel, ...toArray(props.labelProps?.style)],
      }}
      style={[inputBaseInput, ...toArray(props?.style)]}
    />
  );
}
