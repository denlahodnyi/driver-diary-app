import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart, type lineDataItem } from 'react-native-gifted-charts';
import dayjs from 'dayjs';
import { screenPaddings } from '~/app/styles';
import { activityModel } from '~/entities/activity';
import {
  CategoriesSelect,
  RangeDatePicker,
  Txt,
  maskCurrency,
} from '~/shared/components';
import { randomRgb } from '~/shared/utils';

type DatesState = {
  end: Date | null;
  start: Date | null;
};
type ChartDataItem = lineDataItem;
type ChartDataState = {
  dataSets: { data: ChartDataItem[] }[];
  maxValue: number;
};

const yAxisSpaceSectionsNum = 10;

const formatDate = (obj: {
  day: string | null;
  hours: string | null;
  month: string | null;
  year: string;
}) => {
  const daysJsObj = dayjs()
    .year(Number(obj.year))
    .month(Number(obj.month || 1) - 1)
    .date(Number(obj.day || 1))
    .hour(Number(obj.hours || 1));

  if (obj.hours) return daysJsObj.format('ddd hh A');
  if (obj.day) return daysJsObj.format('DD MMM YYYY');
  if (obj.month) return daysJsObj.format('MMM YYYY');
  return daysJsObj.format('YYYY');
};

const prepareChartData = (arr: activityModel.CostReportDataItem[]) => {
  return arr.reduce<{ data: ChartDataItem[]; maxValue: number }>(
    (prev, reportDataItem) => {
      return {
        data: [
          ...prev.data,
          {
            dataPointLabelShiftY: -16,
            label: formatDate(reportDataItem),
            value: reportDataItem.totalCostConverted,
            // eslint-disable-next-line sort-keys
            focusedDataPointLabelComponent: () => (
              <View>
                <Txt style={styles.dataPointLabelText}>
                  {maskCurrency(reportDataItem.totalCost.toString(), {
                    currencyCode: reportDataItem.currencyCode,
                  })}
                </Txt>
              </View>
            ),
          },
        ],
        maxValue: Math.max(prev.maxValue, reportDataItem.totalCostConverted),
      };
    },
    { data: [], maxValue: 0 },
  );
};

export default function ExpenditureStats() {
  const [dates, setDates] = useState<DatesState>({ end: null, start: null });
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [chartData, setChartData] = useState<ChartDataState>({
    dataSets: [{ data: [] }],
    maxValue: 0,
  });
  const [chartRefreshKey, setChartRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const fetchAnalysis = async () => {
        try {
          const result = await activityModel.getCostAnalysis({
            categoryIds,
            dateEnd: dates.end,
            dateStart: dates.start,
          });

          if (result) {
            let maxValue = 0;
            const nextChartData: ChartDataState = {
              dataSets: result.currencyCodes.length
                ? result.currencyCodes.map((code, i) => {
                    const { data, maxValue: max } = prepareChartData(
                      result.byCurrencyCode[code],
                    );

                    maxValue = Math.max(maxValue, max);

                    return {
                      color: randomRgb(i),
                      data,
                      dataPointsColor: randomRgb(i),
                    };
                  })
                : [{ data: [] }],
              maxValue,
            };

            setChartData(nextChartData);
            setChartRefreshKey((prev) => prev + 1);
          }
        } catch (err) {
          console.error(err);
        }
      };

      fetchAnalysis();
    }, [categoryIds, dates.end, dates.start]),
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
      <View style={styles.chartWrapper}>
        <LineChart
          // this to avoid buggy line redraw on data change
          key={chartRefreshKey}
          curved
          focusEnabled
          hideRules
          isAnimated
          showStripOnFocus
          showVerticalLines
          dataPointsRadius={5}
          dataSet={chartData.dataSets}
          height={400}
          initialSpacing={40}
          maxValue={chartData.maxValue}
          noOfSections={yAxisSpaceSectionsNum}
          overflowTop={20}
          spacing={100}
          stepValue={chartData.maxValue / yAxisSpaceSectionsNum}
          stripColor={'#000'}
          yAxisExtraHeight={30}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartWrapper: {
    width: '100%',
  },
  dataPointLabelText: {
    fontSize: 18,
  },
  datesContainer: {
    marginBottom: 15,
  },
  filtersContainer: {
    marginBottom: 20,
  },
});
