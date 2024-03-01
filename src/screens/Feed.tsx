import { StyleSheet, Text, View } from 'react-native';
import { card, screenPaddings } from '~/app/styles';
import { ActivitiesToolbar, Timeline } from '~/widgets/activities/feed';
import { activityModel } from '~/entities/activity';
import { Txt } from '~/shared/components';

export default function Feed() {
  const [activities] = activityModel.useActivities();
  // TODO: return to Vehicles if no saved vehicle were found
  console.log(`🚀 -> Timeline -> activities:`, activities);

  if (!activities.length) {
    return (
      <View style={[screenPaddings, styles.screenCentered]}>
        <View style={styles.floatingToolbarContainer}>
          <ActivitiesToolbar containerStyle={styles.floatingToolbar} />
        </View>
        <Txt>You have no activities yet</Txt>
      </View>
    );
  }

  return (
    <View style={screenPaddings}>
      <View style={styles.floatingToolbarContainer}>
        <ActivitiesToolbar containerStyle={styles.floatingToolbar} />
      </View>
      <Timeline activities={activities} />
    </View>
  );
}

const styles = StyleSheet.create({
  floatingToolbar: {
    shadowColor: '#CECECE',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 4,
    shadowOpacity: 0.5,
  },
  floatingToolbarContainer: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenCentered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
