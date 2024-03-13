import { useState } from 'react';
import { View } from 'react-native';
import { screenPaddings } from '~/app/styles';
import RangeDatePicker, { type ConfirmParam } from './RangeDatePicker';

export default {
  'Without initial dates': () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [dates, setDates] = useState<ConfirmParam>({
      end: null,
      start: null,
    });

    return (
      <View style={screenPaddings}>
        <RangeDatePicker
          dates={dates}
          onConfirm={(o) => {
            console.log('confirm', o);
            setDates(o);
          }}
        />
      </View>
    );
  },
  // eslint-disable-next-line sort-keys
  'With passed dates': () => (
    <View style={screenPaddings}>
      <RangeDatePicker
        dates={{ end: new Date(), start: new Date() }}
        onConfirm={(o) => console.log('confirm', o)}
      />
    </View>
  ),
};
