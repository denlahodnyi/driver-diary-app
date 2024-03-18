import { useCallback, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';
import type { NavTypes } from '~/app/navigation';
import { card, screenPaddings } from '~/app/styles';
import { vehicleModel } from '~/entities/vehicle';
import { categoryLib } from '~/entities/category';
import { Txt } from '~/shared/components';
import type { Activity } from 'db';

// TODO: add empty message
export default function Bookmarks(
  props: NavTypes.ActivitiesScreenProps<'Bookmarks'>,
) {
  const { navigation } = props;
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

  return (
    <View style={screenPaddings}>
      {bookmarks.map((bookmark) => {
        const category = categoryLib.findCategoryById(bookmark.categoryId);
        const categoryName = category
          ? category.subcategories.find(
              (sc) => sc.id === bookmark.subcategoryId,
            )?.name
          : null;

        return (
          <TouchableWithoutFeedback
            key={bookmark.id}
            onPress={() =>
              navigation.navigate('Activity', {
                activityId: bookmark.id,
                mode: 'view',
              })
            }
          >
            <View style={styles.item}>
              <View>
                <Txt style={styles.itemTitle}>{category?.name || 'N/A'}</Txt>
                {categoryName && (
                  <Txt style={styles.itemSubtitle}>{categoryName}</Txt>
                )}
              </View>
              <Txt style={styles.dateTxt}>
                {dayjs(bookmark.date).format('DD MMM YYYY')}
              </Txt>
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  dateTxt: {
    lineHeight: 18,
  },
  item: {
    ...card,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '100%',
  },
  itemSubtitle: {
    color: 'grey',
    fontSize: 16,
  },
  itemTitle: {
    fontSize: 18,
    lineHeight: 18,
  },
});
