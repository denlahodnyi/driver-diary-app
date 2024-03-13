import PickerSelect, {
  type PickerSelectProps,
} from 'react-native-picker-select';
import { toArray } from '~/shared/utils';
import {
  inputBaseContainer,
  inputBaseError,
  inputBaseInput,
  inputBaseInputWrapper,
  inputBaseLabel,
} from '~/app/styles';
import HeadlessInput, { type HeadlessInputProps } from './HeadlessInput';

export type PickerInputProps = HeadlessInputProps<PickerSelectProps>;

export default function PickerInput(props: PickerInputProps) {
  return (
    <HeadlessInput<PickerSelectProps>
      {...props}
      InputComponent={PickerSelect}
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
      style={{
        inputAndroid: {
          ...inputBaseInput,
          ...props.style,
        },
        inputIOS: {
          ...inputBaseInput,
          ...props.style,
        },
      }}
    />
  );
}
