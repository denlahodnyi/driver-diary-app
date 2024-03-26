import { useCallback, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import type { NavTypes } from '~/app/navigation';
import { listItem, screenPaddings } from '~/app/styles';
import { vehicleModel } from '~/entities/vehicle';
import { categoryLib } from '~/entities/category';
import { Txt } from '~/shared/components';
import type { Activity } from 'db';

export default function Bookmarks(
  props: NavTypes.ActivitiesScreenProps<'Bookmarks'>,
) {
  const { navigation } = props;
  const { styles, theme } = useStyles(stylesheet);
  const [vehicle] = vehicleModel.useCurrentVehicle();
  const [bookmarks, setBookmarks] = useState<Activity[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getAndSaveBookmarks = async () => {
        const records = await vehicle?.bookmarkedActivities.fetch();

        if (isActive) setBookmarks(records || []);
      };

      if (vehicle) {
        getAndSaveBookmarks();
      }

      return () => {
        isActive = false;
      };
    }, [vehicle]),
  );

  if (!bookmarks.length) {
    return (
      <View style={[screenPaddings, styles.screenCentered]}>
        <Txt style={styles.emptyListMessage}>You have no bookmarks</Txt>
      </View>
    );
  }

  return (
    <ScrollView style={screenPaddings}>
      {bookmarks.map((bookmark, i, array) => {
        const category = categoryLib.findCategoryById(bookmark.categoryId);
        const categoryName = category
          ? category.subcategories.find(
              (sc) => sc.id === bookmark.subcategoryId,
            )?.name
          : null;

        return (
          <TouchableOpacity
            key={bookmark.id}
            style={listItem(theme, {
              isFirst: i === 0,
              isLast: i === array.length - 1,
            })}
            onPress={() =>
              navigation.navigate('Activity', {
                activityId: bookmark.id,
                mode: 'view',
              })
            }
          >
            <View style={styles.itemContent}>
              <View>
                <Txt fontWeight="bold" style={styles.itemTitle}>
                  {category?.name || 'N/A'}
                </Txt>
                {categoryName && (
                  <Txt style={styles.itemSubtitle}>{categoryName}</Txt>
                )}
              </View>
              <Txt style={styles.dateTxt}>
                {dayjs(bookmark.date).format('DD MMM YYYY')}
              </Txt>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  dateTxt: {
    lineHeight: 24,
  },
  emptyListMessage: {
    color: theme.colors.text.secondary,
    fontSize: 18,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemSubtitle: {
    color: theme.colors.text.secondary,
    fontSize: 16,
  },
  itemTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  screenCentered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
}));
