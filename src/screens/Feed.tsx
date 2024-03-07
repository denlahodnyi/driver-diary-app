import { StyleSheet, View } from 'react-native';
import { screenPaddings } from '~/app/styles';
import { ActivitiesToolbar, Timeline } from '~/widgets/activities/feed';
import { activityModel } from '~/entities/activity';
import { Txt } from '~/shared/components';

export default function Feed() {
  const [activities, { options, setOptions }] = activityModel.useActivities();
  const isFilterActive: boolean =
    options.categoryIds.length > 0 || !!options.startDate || !!options.endDate;

  if (!activities || (!activities.length && !isFilterActive)) {
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
        <ActivitiesToolbar
          canSort={isFilterActive || activities.length > 1}
          containerStyle={styles.floatingToolbar}
          selectedFilters={options}
          onFiltersApply={setOptions}
        />
      </View>
      <Timeline activities={activities} />
    </View>
  );
}

const styles = StyleSheet.create({
  floatingToolbar: {
    shadowColor: '#CECECE',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  floatingToolbarContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 4,
    zIndex: 10,
  },
  screenCentered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
