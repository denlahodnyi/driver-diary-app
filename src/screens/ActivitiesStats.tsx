import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { PieChart, type pieDataItem } from 'react-native-gifted-charts';
import { activityModel } from '~/entities/activity';
import { screenPaddings } from '~/app/styles';
import { CategoriesSelect, RangeDatePicker, Txt } from '~/shared/components';
import { randomRgb } from '~/shared/utils';

type DatesState = {
  end: Date | null;
  start: Date | null;
};
type ChartDataItem = pieDataItem & { label: string };
type ChartDataState = (pieDataItem & { label: string })[];

export default function ActivitiesStats() {
  const [dates, setDates] = useState<DatesState>({ end: null, start: null });
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [chartData, setChartData] = useState<ChartDataState>([]);
  const [focusedIdx, setFocusedIdx] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const fetchAnalysis = async () => {
        try {
          const result = await activityModel.getCategoriesAnalysis({
            categoryIds,
            dateEnd: dates.end,
            dateStart: dates.start,
          });

          if (result) {
            const data = result.map<ChartDataItem>((c, i) => ({
              color: randomRgb(i),
              focused: i === 0,
              label: c.categoryName || 'N/A',
              value: c.total,
            }));

            setChartData(data);
          }
        } catch (err) {
          console.error(err);
        }
      };

      fetchAnalysis();
    }, [categoryIds, dates.end, dates.start]),
  );

  const renderCentralLabel = () => (
    <View>
      <Txt adjustsFontSizeToFit style={styles.centralLabel}>
        {chartData[focusedIdx].label}
      </Txt>
    </View>
  );

  return (
    <View style={screenPaddings}>
      <View style={styles.filtersContainer}>
        <RangeDatePicker
          pickerContainerStyle={styles.datesContainer}
          onConfirm={(obj) => setDates(obj)}
        />
        <CategoriesSelect
          isMultiple
          value={categoryIds}
          onChange={(id) => setCategoryIds(id)}
        />
      </View>
      <View style={styles.chartContainer}>
        <PieChart
          donut
          // focusOnPress
          sectionAutoFocus
          centerLabelComponent={renderCentralLabel}
          data={chartData.map((o, i) => ({ ...o, focused: i === focusedIdx }))}
          innerRadius={100}
          radius={160}
          toggleFocusOnPress={false}
          onPress={(_: ChartDataItem, i: number) => setFocusedIdx(i)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centralLabel: {
    fontSize: 22,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
  },
  datesContainer: {
    marginBottom: 15,
  },
  filtersContainer: {
    marginBottom: 20,
  },
});
