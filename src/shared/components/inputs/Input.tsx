import { StyleSheet } from 'react-native';
import {
  inputBaseContainer,
  inputBaseError,
  inputBaseInput,
  inputBaseInputWrapper,
  inputBaseLabel,
} from '~/app/styles';
import { toArray } from '~/shared/utils';
import HeadlessInput, { type HeadlessInputProps } from './HeadlessInput';

type InputProps = HeadlessInputProps;

export default function Input(props: InputProps) {
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
      style={[inputBaseInput, ...toArray(props.style)]}
    />
  );
}
const styles = StyleSheet.create({});
