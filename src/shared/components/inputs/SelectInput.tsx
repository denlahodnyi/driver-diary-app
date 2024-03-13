import Dropdown, { type DropdownSelect } from 'react-native-input-select';
import {
  inputBaseContainer,
  inputBaseError,
  inputBaseInput,
  inputBaseLabel,
} from '~/app/styles';

export type SelectInputProps = Parameters<typeof DropdownSelect>[0];

export default function SelectInput(props: SelectInputProps) {
  return (
    <Dropdown
      dropdownErrorTextStyle={inputBaseError}
      labelStyle={inputBaseLabel}
      searchControls={{
        textInputContainerStyle: inputBaseContainer,
        textInputStyle: inputBaseInput,
      }}
      {...props}
    />
  );
}
