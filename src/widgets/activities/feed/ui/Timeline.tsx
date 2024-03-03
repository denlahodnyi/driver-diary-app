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

const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: '2-digit',
});

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
              {dates.map((date) => {
                const activitiesByDate = byDate[date];
                const dateObj = new Date(date);
                const formattedDate = dateTimeFormat
                  .formatToParts(dateObj)
                  .reduce<string>((prev, part) => {
                    if (part.type === 'day') return `${part.value}${prev}`;
                    else if (part.type === 'month')
                      return `${prev} ${part.value}`;
                    return prev;
                  }, '');

                return (
                  <View key={date} style={styles.group}>
                    <View>
                      <Txt style={styles.groupHeader}>{formattedDate}</Txt>
                    </View>
                    <View style={styles.activitiesGroup}>
                      {activitiesByDate.map((activity) => {
                        const category = categoryLib.findCategoryById(
                          activity.categoryId,
                        );
                        const subcategoryName =
                          activity.subcategoryId && category
                            ? category.subcategories.find(
                                (sc) => sc.id === activity.subcategoryId,
                              )?.name
                            : null;

                        return (
                          <View
                            key={activity.id}
                            style={styles.activityItemContainer}
                          >
                            <HorizontalSwipeView
                              config={{ isRightSwipeDisabled: true }}
                              renderRightElement={({ resetSwipedState }) => (
                                <View
                                  style={styles.activityItemActionsContainer}
                                >
                                  <TouchableOpacity
                                    accessibilityLabel={
                                      activity.isBookmark
                                        ? 'Remove bookmark'
                                        : 'Save as bookmark'
                                    }
                                    style={styles.activityItemActionButton}
                                    onPress={() => {
                                      resetSwipedState();
                                      activity.toggleBookmark();
                                    }}
                                  >
                                    <Icon name="bookmark" size={20} />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    accessibilityLabel="Edit item"
                                    style={styles.activityItemActionButton}
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
                                        style={styles.activityItemActionButton}
                                        onPress={() => {
                                          handleDeleteActivity(
                                            activity.id,
                                            () => {
                                              resetSwipedState();
                                            },
                                          );
                                        }}
                                      >
                                        <Icon name="trash" size={20} />
                                      </TouchableOpacity>
                                    )}
                                  </ActivityDeleteDecorator>
                                </View>
                              )}
                              style={styles.activityItem}
                              onPress={() =>
                                handleNavigateToActivity(activity.id)
                              }
                            >
                              <View>
                                <Txt style={styles.activityTitle}>
                                  {category?.name || 'N/A'}
                                </Txt>
                                {subcategoryName && (
                                  <Txt style={styles.activitySubtitle}>
                                    {subcategoryName}
                                  </Txt>
                                )}
                              </View>
                              {activity.isBookmark && (
                                <Icon
                                  name="bookmark"
                                  size={18}
                                  style={styles.bookmark}
                                />
                              )}
                            </HorizontalSwipeView>
                          </View>
                        );
                      })}
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
  activityItem: {
    ...card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: '100%',
    zIndex: 10,
  },
  activityItemActionButton: {
    padding: 10,
  },
  activityItemActionsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    position: 'absolute',
    right: 0,
    zIndex: 5,
  },
  activityItemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 6,
    position: 'relative',
    width: '100%',
  },
  activitySubtitle: {
    color: 'grey',
    fontSize: 16,
  },
  activityTitle: {
    fontSize: 18,
  },
  bookmark: {
    position: 'absolute',
    right: 10,
    top: -2,
  },
  group: {
    // flexDirection: 'row',
  },
  groupHeader: {
    fontSize: 24,
  },
  section: {
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 40,
    marginBottom: 10,
  },
});
