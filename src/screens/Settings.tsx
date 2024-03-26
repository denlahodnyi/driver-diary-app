import { StyleSheet, View } from 'react-native';
import { useStorageString } from '~/app/storage';
import { inputBaseLabel, screenPaddings } from '~/app/styles';
import { ThemeSwitcher } from '~/features/switchColorTheme';
import { CurrencySelect, Txt } from '~/shared/components';

export default function Settings() {
  const [currencyCode, setCurrencyCode] = useStorageString('currencyCode');

  return (
    <View style={screenPaddings}>
      <CurrencySelect
        label="Default currency"
        placeholder={{}}
        value={currencyCode}
        onValueChange={(code) => setCurrencyCode(code)}
      />
      <Txt style={inputBaseLabel()}>Theme</Txt>
      <View style={styles.switcherWrapper}>
        <ThemeSwitcher />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  switcherWrapper: {
    alignItems: 'flex-start',
  },
});
