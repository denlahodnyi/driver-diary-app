import {
  TextInput,
  type TextInputProps,
  View,
  type ViewProps,
} from 'react-native';
import Txt, { type TxtProps } from '../text/Txt';

export type HeadlessInputProps<T extends object = TextInputProps> = {
  containerProps?: ViewProps;
  endElement?: React.ReactNode;
  error?: string;
  errorProps?: TxtProps;
  InputComponent?: React.ElementType;
  inputWrapperProps?: ViewProps;
  label?: string;
  labelProps?: TxtProps;
  startElement?: React.ReactNode;
} & T;

export default function HeadlessInput<TProps extends object = TextInputProps>(
  props: HeadlessInputProps<TProps>,
) {
  const {
    InputComponent,
    containerProps,
    endElement = null,
    error,
    errorProps,
    inputWrapperProps,
    label,
    labelProps,
    startElement = null,
    ...inputProps
  } = props;
  // const Input = (InputComponent || TextInput) as React.ElementType;
  const Input = InputComponent || TextInput;

  return (
    <View {...containerProps}>
      {label && <Txt {...labelProps}>{label}</Txt>}
      <View {...inputWrapperProps}>
        {startElement}
        <Input {...inputProps} />
        {endElement}
      </View>
      {error && <Txt {...errorProps}>{error}</Txt>}
    </View>
  );
}
