import SelectInput, { type SelectInputProps } from './SelectInput';

const codes = ['USD', 'EUR', 'GBP', 'UAH'];

const selectableCodes = codes.map((code) => ({ label: code, value: code }));

type CurrencySelectProps = Omit<SelectInputProps, 'items'>;

export default function CurrencySelect(props: CurrencySelectProps) {
  return <SelectInput {...props} items={selectableCodes} />;
}
