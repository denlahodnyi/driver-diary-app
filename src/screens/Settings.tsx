import { View } from 'react-native';
import { useStorageString } from '~/app/storage';
import { screenPaddings } from '~/app/styles';
import { CurrencySelect } from '~/shared/components';

// TODO: color theme

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
    </View>
  );
}
// const styles = StyleSheet.create({});
