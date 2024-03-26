import { categoriesWithIds } from 'db/data';
import SelectInput, { type SelectInputProps } from './SelectInput';

const categories = categoriesWithIds.map((o) => ({
  id: o.id,
  name: o.name,
}));

export type CategoriesSelectProps<TIsMultiple extends boolean> = Omit<
  SelectInputProps,
  'options' | 'onValueChange'
> & {
  isMultiple?: TIsMultiple;
  onChange: (c: TIsMultiple extends true ? string[] : string) => void;
  value: TIsMultiple extends true ? string[] : string | null | undefined;
};

export default function CategoriesSelect<TIsMultiple extends boolean = false>(
  props: CategoriesSelectProps<TIsMultiple>,
) {
  const { onChange, value, ...rest } = props;

  return (
    <SelectInput
      {...rest}
      optionLabel="name"
      optionValue="id"
      options={categories}
      placeholder="Select categories..."
      selectedValue={value}
      onValueChange={onChange}
    />
  );
}
