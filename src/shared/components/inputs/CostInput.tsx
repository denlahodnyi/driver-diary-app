import {
  MaskedTextInput,
  type MaskedTextInputProps,
  mask,
} from 'react-native-mask-text';
import getSymbolFromCurrency from 'currency-symbol-map';
import { toArray } from '~/shared/utils';
import {
  inputBaseContainer,
  inputBaseError,
  inputBaseInput,
  inputBaseInputWrapper,
  inputBaseLabel,
} from '~/app/styles';
import HeadlessInput, { type HeadlessInputProps } from './HeadlessInput';

type CurrencyInputProps = HeadlessInputProps<MaskedTextInputProps>;

const maskOptions = {
  decimalSeparator: '.',
  groupSeparator: ',',
  precision: 2,
};

export const maskCurrency = (
  value: string,
  opts: {
    currencyCode?: string;
    options?: { prefix?: string };
    pattern?: string | string[];
  },
) =>
  mask(value, opts.pattern, 'currency', {
    ...maskOptions,
    prefix: opts.currencyCode ? getSymbolFromCurrency(opts.currencyCode) : '',
    ...opts.options,
  });

export default function CurrencyInput(props: CurrencyInputProps) {
  return (
    <HeadlessInput<MaskedTextInputProps>
      {...props}
      InputComponent={MaskedTextInput}
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
      keyboardType="numeric"
      labelProps={{
        style: [inputBaseLabel, ...toArray(props.labelProps?.style)],
      }}
      options={maskOptions}
      style={[inputBaseInput, ...toArray(props?.style)]}
      type="currency"
    />
  );
}
