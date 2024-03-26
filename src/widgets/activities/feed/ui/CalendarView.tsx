import { useCallback, useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import {
  Calendar,
  type CalendarProps,
  type DateData,
} from 'react-native-calendars';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { appFonts, listItem } from '~/app/styles';
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

  const { styles, theme } = useStyles(stylesheet);
  const primaryColor = theme.colors.primary.default;

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
          ...(prev[formattedDate] || {
            color: primaryColor,
            marked: true,
          }),
          items: [...(prev[formattedDate]?.items || []), current],
          selected: selectedDateData?.dateString === formattedDate,
        },
      };
    }, {});
  }, [currentMonthActivities, selectedDateData?.dateString, primaryColor]);

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
    <View style={styles.container}>
      <Calendar
        // update key to force colors update on theme change
        key={theme.isDark ? 'dark' : 'light'}
        disableAllTouchEventsForDisabledDays
        hideExtraDays
        markedDates={markedDates}
        maxDate={maxDate}
        style={styles.calendarContainer}
        theme={{
          arrowColor: primaryColor,
          backgroundColor: theme.colors.surface.default,
          calendarBackground: theme.colors.surface.default,
          dayTextColor: theme.colors.text.primary,
          dotColor: primaryColor,
          indicatorColor: primaryColor,
          monthTextColor: theme.colors.text.primary,
          selectedDayBackgroundColor: primaryColor,
          // textDisabledColor: theme.colors.text.secondary,
          textDayFontFamily: appFonts.Poppins.regular,
          textDayHeaderFontFamily: appFonts.Poppins.regular,
          textMonthFontFamily: appFonts.Poppins.regular,
          textSectionTitleColor: theme.colors.text.primary,
          todayTextColor: primaryColor,
        }}
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
      />
      {selectedDateData && (
        <Txt style={styles.scrollViewTitle}>
          {`Activities on `}
          <Txt fontWeight="bold">
            {dayjs(selectedDateData.timestamp).format('DD MMMM')}
          </Txt>
        </Txt>
      )}
      {selectedDateData && markedDates[selectedDateData.dateString] && (
        <ScrollView>
          {markedDates[selectedDateData.dateString].items.map(
            (item, i, array) => {
              const category = categoryLib.findCategoryById(item.categoryId);
              const subcategory = category
                ? category.subcategories.find(
                    (c) => c.id === item.subcategoryId,
                  )
                : null;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={listItem(theme, {
                    isFirst: i === 0,
                    isLast: i === array.length - 1,
                  })}
                  onPress={() =>
                    navigation.navigate('Activity', {
                      activityId: item.id,
                      mode: 'view',
                    })
                  }
                >
                  <View>
                    <Txt fontWeight="bold" style={styles.activityTitle}>
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
            },
          )}
        </ScrollView>
      )}
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  activitySubtitle: {
    color: theme.colors.text.secondary,
    fontSize: 16,
  },
  activityTitle: {
    fontSize: 18,
  },
  calendarContainer: {
    marginBottom: 14,
  },
  container: { flex: 1, paddingTop: 45 },
  scrollViewTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
}));
