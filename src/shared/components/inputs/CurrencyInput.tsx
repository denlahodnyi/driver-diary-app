import {
  MaskedTextInput,
  type MaskedTextInputProps,
  mask,
} from 'react-native-mask-text';
import Input, { type InputProps } from './Input';

type CurrencyInputProps = InputProps<MaskedTextInputProps>;

const maskOptions = {
  decimalSeparator: '.',
  groupSeparator: ',',
  precision: 2,
};

export const maskCurrency = (value: string, pattern?: string | string[]) =>
  mask(value, pattern, 'currency', maskOptions);

export default function CurrencyInput(props: CurrencyInputProps) {
  return (
    <Input<MaskedTextInputProps>
      {...props}
      InputComponent={MaskedTextInput}
      keyboardType="numeric"
      options={maskOptions}
      type="currency"
    />
  );
}
