import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  Calendar,
  type CalendarProps,
  type DateData,
} from 'react-native-calendars';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import { card } from '~/app/styles';
import { Txt } from '~/shared/components';
import { categoryLib } from '~/entities/category';
import { type Activity } from 'db';

type CalendarViewProps = {
  activities: Activity[];
};

type MarkedDatesProp = NonNullable<CalendarProps['markedDates']>[string];

const CALENDAR_DATE_FORMAT = 'YYYY-MM-DD';

export default function CalendarView(props: CalendarViewProps) {
  const { activities } = props;

  const navigation = useNavigation();
  const [selectedMonthDateStr, setSelectedMonthDateStr] = useState(
    dayjs(new Date()).format(CALENDAR_DATE_FORMAT),
  );
  const [selectedDateData, setSelectedDateData] = useState<null | DateData>(
    null,
  );

  const currentMonthActivities = useMemo(() => {
    return activities.filter((a) =>
      dayjs(a.date).isSame(selectedMonthDateStr, 'month'),
    );
  }, [activities, selectedMonthDateStr]);

  const markedDates = useMemo(() => {
    return currentMonthActivities.reduce<
      Record<string, MarkedDatesProp & { items: Activity[] }>
    >((prev, current) => {
      const formattedDate = dayjs(current.date).format(CALENDAR_DATE_FORMAT);

      return {
        ...prev,
        [formattedDate]: {
          ...(prev[formattedDate] || { color: 'blue', marked: true }),
          items: [...(prev[formattedDate]?.items || []), current],
          selected: selectedDateData?.dateString === formattedDate,
        },
      };
    }, {});
  }, [currentMonthActivities, selectedDateData?.dateString]);

  const maxDate = useMemo(() => dayjs().format(CALENDAR_DATE_FORMAT), []);

  const handleDayPress = useCallback(
    (dateData: DateData) =>
      setSelectedDateData((prev) =>
        prev?.dateString === dateData.dateString ? null : dateData,
      ),
    [],
  );

  const handleMonthChange = useCallback((dateData: DateData) => {
    setSelectedMonthDateStr(dateData.dateString);
    setSelectedDateData(null);
  }, []);

  return (
    <View style={{ flex: 1, paddingTop: 45 }}>
      <Calendar
        disableAllTouchEventsForDisabledDays
        hideExtraDays
        markedDates={markedDates}
        maxDate={maxDate}
        style={styles.calendarContainer}
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
      />
      {selectedDateData && (
        <Txt style={styles.scrollViewTitle}>{`Activities on ${dayjs(
          selectedDateData.timestamp,
        ).format('DD MMMM')}`}</Txt>
      )}
      {selectedDateData && markedDates[selectedDateData.dateString] && (
        <ScrollView>
          {markedDates[selectedDateData.dateString].items.map((item) => {
            const category = categoryLib.findCategoryById(item.categoryId);
            const subcategory = category
              ? category.subcategories.find((c) => c.id === item.subcategoryId)
              : null;

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() =>
                  navigation.navigate('Activity', {
                    activityId: item.id,
                    mode: 'view',
                  })
                }
              >
                <View>
                  <Txt style={styles.activityTitle}>
                    {category?.name || 'N/A'}
                  </Txt>
                  {subcategory && (
                    <Txt style={styles.activitySubtitle}>
                      {subcategory.name}
                    </Txt>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  activitySubtitle: {
    color: 'grey',
    fontSize: 16,
  },
  activityTitle: {
    fontSize: 18,
  },
  calendarContainer: {
    marginBottom: 14,
  },
  card: {
    ...card,
    marginBottom: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: '100%',
  },
  scrollViewTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
});
