import {
  TextInput,
  type TextInputProps,
  View,
  type ViewProps,
} from 'react-native';
import Txt, { type TxtProps } from '../text/Txt';

export type HeadlessInputProps = {
  containerProps?: ViewProps;
  endElement?: React.ReactNode;
  error?: string;
  errorProps?: TxtProps;
  inputWrapperProps?: ViewProps;
  label?: string;
  labelProps?: TxtProps;
  startElement?: React.ReactNode;
} & TextInputProps;

export default function HeadlessInput(props: HeadlessInputProps) {
  const {
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

  return (
    <View {...containerProps}>
      {label && <Txt {...labelProps}>{label}</Txt>}
      <View {...inputWrapperProps}>
        {startElement}
        <TextInput {...inputProps} />
        {endElement}
      </View>
      {error && <Txt {...errorProps}>{error}</Txt>}
    </View>
  );
}
