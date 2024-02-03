import { SectionList, StyleSheet, View } from 'react-native';
import { card } from '~/app/styles';
import { Txt } from '~/shared/components';

const data = [
  { id: 1, date: '2023-09-01', category: 'Petrol' },
  { id: 2, date: '2023-09-10', category: 'Repair' },
  { id: 3, date: '2023-11-23', category: 'Repair' },
  { id: 4, date: '2023-11-23', category: 'Wash' },
  { id: 5, date: '2023-12-11', category: 'Petrol' },
  { id: 6, date: '2023-12-30', category: 'Petrol' },
  { id: 7, date: '2024-01-02', category: 'Repair' },
  { id: 8, date: '2024-01-12', category: 'Wash' },
  { id: 9, date: '2024-01-13', category: 'Petrol' },
];

type List = {
  years: number[];
  byYear: Record<
    number,
    {
      byDate: Record<string, (typeof data)[number][]>;
      dates: string[];
    }
  >;
};

const groupedData = data.reduce<List>(
  (prev, current) => {
    const result = { ...prev };
    const year = +current.date.split('-')[0];

    if (!result.years.includes(year)) {
      result.years.push(year);
      result.byYear[year] = {
        byDate: {
          [current.date]: [current],
        },
        dates: [current.date],
      };
    } else {
      const yearDates = result.byYear[year];

      if (!yearDates.dates.includes(current.date)) {
        yearDates.dates.push(current.date);
        yearDates.byDate[current.date] = [current];
      } else {
        yearDates.byDate[current.date].push(current);
      }

      result.byYear[year] = yearDates;
    }
    return result;
  },
  { byYear: {}, years: [] },
);

export default function Timeline() {
  return (
    <>
      <SectionList
        renderItem={({ item, section }) => {
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
                        <View style={styles.activity}>
                          <Txt key={activity.id}>{activity.category}</Txt>
                        </View>
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
        sections={groupedData.years.map((year) => ({
          data: [groupedData.byYear[year]],
          year,
        }))}
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
  section: {
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 40,
    marginBottom: 10,
  },
});
