import { useMemo } from 'react';
import { SectionList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { card } from '~/app/styles';
import { HorizontalSwipeView, Icon, Txt } from '~/shared/components';
import { ActivityDeleteDecorator } from '~/features/activities/delete';
import { activityLib } from '~/entities/activity';
import { categoryLib } from '~/entities/category';
import type { Activity } from 'db';

type TimelineProps = {
  activities: Activity[];
};

// TODO: sort by date

export default function Timeline(props: TimelineProps) {
  const { activities } = props;
  const navigation = useNavigation();

  const sectionListData = useMemo(() => {
    const data = activityLib.groupActivitiesByDate(activities);

    return data.years.map((year) => ({
      data: [data.byYear[year]],
      year,
    }));
  }, [activities]);

  const handleNavigateToActivity = (activityId: string) => {
    navigation.navigate('Activity', { activityId, mode: 'view' });
  };

  const handleUpdateActivity = (activityId: string) => {
    navigation.navigate('Activity', { activityId, mode: 'update' });
  };

  return (
    <>
      <SectionList
        renderItem={(listItem) => {
          const { item, section } = listItem;
          const { byDate, dates } = item;

          return (
            <View key={section.year} style={styles.section}>
              {/* <Txt style={styles.sectionHeader}>{year}</Txt> */}
              {dates.map((date) => {
                const activitiesByDate = byDate[date];
                const dateObj = new Date(date);
                const formattedDate = `${dateObj.getDate()}.${
                  dateObj.getMonth() + 1
                }`;

                return (
                  <View key={date} style={styles.group}>
                    <View>
                      <Txt style={styles.groupHeader}>{formattedDate}</Txt>
                    </View>
                    <View style={styles.activitiesGroup}>
                      {activitiesByDate.map((activity) => (
                        <HorizontalSwipeView
                          key={activity.id}
                          config={{ isRightSwipeDisabled: true }}
                          renderRightElement={({ resetSwipedState }) => (
                            <View style={styles.listItemActionsContainer}>
                              <TouchableOpacity
                                accessibilityLabel="Edit item"
                                style={styles.listItemActionButton}
                                onPress={() => {
                                  resetSwipedState();
                                  handleUpdateActivity(activity.id);
                                }}
                              >
                                <Icon name="pencil" size={20} />
                              </TouchableOpacity>
                              <ActivityDeleteDecorator>
                                {(handleDeleteActivity) => (
                                  <TouchableOpacity
                                    accessibilityLabel="Delete item"
                                    style={styles.listItemActionButton}
                                    onPress={() => {
                                      handleDeleteActivity(activity.id, () => {
                                        resetSwipedState();
                                      });
                                    }}
                                  >
                                    <Icon name="trash" size={20} />
                                  </TouchableOpacity>
                                )}
                              </ActivityDeleteDecorator>
                            </View>
                          )}
                          style={styles.listItem}
                          onPress={() => handleNavigateToActivity(activity.id)}
                        >
                          <View style={styles.activity}>
                            <Txt>
                              {categoryLib.findCategoryById(activity.categoryId)
                                ?.name || 'N/A'}
                            </Txt>
                          </View>
                        </HorizontalSwipeView>
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>
          );
        }}
        renderSectionHeader={({ section }) => (
          <Txt style={styles.sectionHeader}>{section.year}</Txt>
        )}
        sections={sectionListData}
      />
    </>
  );
}

const styles = StyleSheet.create({
  activitiesGroup: {
    // width: '100%',
    flex: 1,
  },
  activity: {
    ...card,
    marginBottom: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: '100%',
  },
  group: {
    // flexDirection: 'row',
  },
  groupHeader: {
    fontSize: 24,
  },
  listItem: {
    zIndex: 10,
  },
  listItemActionButton: {
    padding: 10,
  },
  listItemActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    position: 'absolute',
    right: 0,
    zIndex: 5,
  },
  section: {
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 40,
    marginBottom: 10,
  },
});
