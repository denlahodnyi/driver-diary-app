import PickerSelect, {
  type PickerSelectProps,
} from 'react-native-picker-select';
import { useStyles } from 'react-native-unistyles';
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
  const { theme } = useStyles();

  return (
    <HeadlessInput<PickerSelectProps>
      {...props}
      InputComponent={PickerSelect}
      containerProps={{
        style: [inputBaseContainer, ...toArray(props.containerProps?.style)],
      }}
      errorProps={{
        style: [inputBaseError(theme), ...toArray(props.errorProps?.style)],
      }}
      inputWrapperProps={{
        style: [
          inputBaseInputWrapper(theme),
          ...toArray(props.inputWrapperProps?.style),
        ],
      }}
      labelProps={{
        style: [inputBaseLabel(), ...toArray(props.labelProps?.style)],
      }}
      style={{
        inputAndroid: {
          ...inputBaseInput(theme),
          ...props.style,
        },
        inputIOS: {
          ...inputBaseInput(theme),
          ...props.style,
        },
      }}
    />
  );
}
