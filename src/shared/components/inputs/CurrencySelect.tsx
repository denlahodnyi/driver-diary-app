import SelectInput, { type PickerInputProps } from './PickerInput';

const codes = ['USD', 'EUR', 'GBP', 'UAH'];

const selectableCodes = codes.map((code) => ({ label: code, value: code }));

type CurrencySelectProps = Omit<PickerInputProps, 'items'>;

export default function CurrencySelect(props: CurrencySelectProps) {
  return <SelectInput {...props} items={selectableCodes} />;
}
