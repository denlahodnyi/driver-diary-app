import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { type NavTypes } from '~/app/navigation';
import { screenPaddings } from '~/app/styles';
import { Txt } from '~/shared/components';

export default function Stats(props: NavTypes.ActivitiesScreenProps<'Stats'>) {
  const { navigation } = props;

  return (
    <View style={screenPaddings}>
      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate('ExpenditureStats')}
      >
        <Txt style={styles.linkText}>Analyze expenditures</Txt>
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate('ActivitiesStats')}
      >
        <Txt style={styles.linkText}>Analyze activities</Txt>
      </TouchableOpacity>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    borderBottomWidth: 1,
    borderColor: '#CECECE',
  },
  link: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  linkText: {
    fontSize: 20,
  },
});
