import Dropdown, { type DropdownSelect } from 'react-native-input-select';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import {
  appFonts,
  inputBaseError,
  inputBaseInput,
  inputBaseInputWrapper,
  inputBaseLabel,
} from '~/app/styles';
import { getLineHeightByFontSize } from '~/shared/utils';
import Icon from '../Icon';

export type SelectInputProps = Parameters<typeof DropdownSelect>[0];

export default function SelectInput(props: SelectInputProps) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <Dropdown
      checkboxControls={{
        checkboxLabelStyle: styles.checkBoxLabel,
      }}
      dropdownErrorTextStyle={inputBaseError(theme)}
      dropdownIcon={
        <Icon
          color={theme.colors.secondary.default}
          name="chevron-down-outline"
          size={18}
        />
      }
      dropdownIconStyle={styles.icon}
      dropdownStyle={styles.input}
      labelStyle={styles.label}
      listComponentStyles={{
        itemSeparatorStyle: styles.separator,
      }}
      modalControls={{
        modalOptionsContainerStyle: styles.modal,
      }}
      multipleSelectedItemStyle={styles.inputItem}
      placeholderStyle={styles.placeholder}
      primaryColor={theme.colors.primary.default}
      selectedItemStyle={styles.inputItem}
      {...props}
    />
  );
}

const stylesheet = createStyleSheet((theme) => ({
  checkBoxLabel: {
    color: theme.colors.text.primary,
    fontFamily: appFonts.Poppins.regular,
  },
  icon: { right: 6, top: 16 },
  input: {
    ...inputBaseInput(theme),
    ...inputBaseInputWrapper(theme),
    backgroundColor: 'transparent',
    minHeight: 'auto',
  },
  inputItem: {
    fontFamily: appFonts.Poppins.regular,
    fontSize: 14,
    lineHeight: getLineHeightByFontSize(14),
  },
  label: {
    ...inputBaseLabel(),
  },
  modal: {
    backgroundColor: theme.colors.surface.default,
  },
  placeholder: {
    color: theme.colors.text.secondary,
    fontFamily: appFonts.Poppins.regular,
  },
  separator: { backgroundColor: theme.colors.secondary.default },
}));
