import { useMemo } from 'react';
import { SectionList, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import dayjs from 'dayjs';
import {
  listItem as listItemStyle,
  swipableListItemLastActionButton,
} from '~/app/styles';
import { HorizontalSwiper, Icon, Txt } from '~/shared/components';
import { ActivityDeleteDecorator } from '~/features/activities/delete';
import { SwiperActivityCopyButton } from '~/features/activities/copy';
import { activityLib } from '~/entities/activity';
import { categoryLib } from '~/entities/category';
import type { Activity } from 'db';

type TimelineProps = {
  activities: Activity[];
};

function DuplicateButton(
  props: { activityId: string; categoryId: string } & Parameters<
    HorizontalSwiper['ActionFn']
  >[0],
) {
  return (
    <SwiperActivityCopyButton
      activityId={props.activityId}
      afterAction={props.renderParam.resetSwipedState}
      categoryId={props.categoryId}
      style={props.style}
    />
  );
}

export default function Timeline(props: TimelineProps) {
  const { activities } = props;
  const navigation = useNavigation();
  const { styles, theme } = useStyles(stylesheet);

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
    <ActivityDeleteDecorator>
      {(handleDelete) => (
        <SectionList
          renderItem={(listItem) => {
            const { item, section } = listItem;
            const { byDate, dates } = item;

            return (
              <View key={section.year} style={styles.section}>
                {dates.map((date) => {
                  const activitiesByDate = byDate[date];
                  const formattedDate = dayjs(date).format('DD MMMM');

                  return (
                    <View key={date} style={styles.group}>
                      <View style={styles.groupHeader}>
                        <Txt style={styles.groupHeaderTitle}>
                          {formattedDate}
                        </Txt>
                      </View>
                      <View style={styles.activitiesGroup}>
                        {activitiesByDate.map((activity, index, array) => {
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
                            <View key={activity.id}>
                              <HorizontalSwiper
                                HorizontalSwipeViewProps={{
                                  config: { isRightSwipeDisabled: true },
                                  onPress: () =>
                                    handleNavigateToActivity(activity.id),
                                }}
                                lastActionButtonStyle={swipableListItemLastActionButton(
                                  theme,
                                  {
                                    isFirst: index === 0,
                                    isLast: index === array.length - 1,
                                  },
                                )}
                                rightActions={[
                                  ({ renderParam, style }) => (
                                    <DuplicateButton
                                      activityId={activity.id}
                                      categoryId={activity.categoryId}
                                      renderParam={renderParam}
                                      style={style}
                                    />
                                  ),
                                  'bookmark',
                                  'update',
                                  'delete',
                                ]}
                                onBookmark={() => activity.toggleBookmark()}
                                onDelete={() => handleDelete(activity.id)}
                                onUpdate={() =>
                                  handleUpdateActivity(activity.id)
                                }
                              >
                                <View
                                  style={[
                                    styles.activityItem,
                                    listItemStyle(theme, {
                                      isFirst: index === 0,
                                      isLast: index === array.length - 1,
                                    }),
                                  ]}
                                >
                                  <View>
                                    <Txt
                                      fontWeight="bold"
                                      style={styles.activityTitle}
                                    >
                                      {category?.name || 'N/A'}
                                    </Txt>
                                    {subcategoryName && (
                                      <Txt style={styles.activitySubtitle}>
                                        {subcategoryName}
                                      </Txt>
                                    )}
                                  </View>
                                  {activity.isBookmark && (
                                    <View style={styles.bookmark}>
                                      <Icon
                                        color={
                                          theme.colors.primary.contrastText
                                        }
                                        name="bookmark"
                                        size={18}
                                      />
                                    </View>
                                  )}
                                </View>
                              </HorizontalSwiper>
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
            <View style={styles.sectionHeader}>
              <Txt fontWeight="black" style={styles.sectionHeaderTitle}>
                {section.year}
              </Txt>
            </View>
          )}
          sections={sectionListData}
        />
      )}
    </ActivityDeleteDecorator>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  activitiesGroup: {
    flex: 1,
  },
  activityItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  activitySubtitle: {
    color: theme.colors.secondary.default,
    fontSize: 16,
  },
  activityTitle: {
    fontSize: 18,
  },
  bookmark: {
    backgroundColor: theme.colors.primary.default,
    bottom: -1,
    justifyContent: 'center',
    paddingHorizontal: 4,
    position: 'absolute',
    right: 10,
    top: -1,
  },
  group: {
    marginBottom: 12,
  },
  groupHeader: {
    marginBottom: 6,
  },
  groupHeaderTitle: {
    fontSize: 24,
  },
  section: {
    marginBottom: 10,
  },
  sectionHeader: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surface.default,
    borderBottomRightRadius: 16,
    borderTopRightRadius: 16,
    marginBottom: 5,
    paddingRight: 14,
  },
  sectionHeaderTitle: {
    color: theme.colors.surface.contrastText,
    fontSize: 40,
  },
}));
