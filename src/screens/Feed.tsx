import { StyleSheet, Text, View } from 'react-native';
import { card, screenPaddings } from '~/app/styles';
import { Timeline } from '~/widgets/activities/feed';

export default function Feed() {
  return (
    <View style={screenPaddings}>
      <Timeline />
    </View>
  );
}

const styles = StyleSheet.create({});
