import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { APP_MIN_DATE_STR } from '~/app/constants';
import { buttonBase, buttonBaseText } from '~/app/styles';
import { Icon, Modalka, Txt } from '~/shared/components';
import { categoriesWithIds } from 'db/data';

const MIN_DATE = new Date(APP_MIN_DATE_STR);

export type ActivitiesFiltersModalProps = {
  onApplyFilters?: (o: FiltersState) => void;
  selectedFilters?: FiltersState;
  onClose: () => void;
  visible: boolean;
};
export type DatesState = {
  end: Date;
  endModified: boolean;
  start: Date;
  startModified: boolean;
};
export type FiltersState = {
  categoryIds: string[];
  dates: DatesState;
};

type DatePickerType = 'start' | 'end';

export default function ActivitiesFiltersModal(
  props: ActivitiesFiltersModalProps,
) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { onApplyFilters, onClose, selectedFilters, visible } = props;

  const [openedDatePicker, setOpenedDatePicker] = useState<
    false | DatePickerType
  >(false);
  const [dates, setDates] = useState<DatesState>({
    end: new Date(),
    endModified: false,
    start: new Date(),
    startModified: false,
  });
  const [categoryIds, setCategoryIds] = useState<string[]>([]);

  useEffect(
    function settleExternalFilters() {
      if (selectedFilters) {
        setCategoryIds(selectedFilters.categoryIds);
        setDates(selectedFilters.dates);
      }
    },
    [selectedFilters],
  );

  const handleApply = () => {
    if (onApplyFilters) onApplyFilters({ categoryIds, dates });
  };

  const resetDate = (pickerType: DatePickerType) => {
    setDates((prev) => ({
      ...prev,
      [pickerType]: new Date(),
      [`${pickerType}Modified`]: false,
    }));
  };

  const confirmDate = (date: Date, pickerType: DatePickerType) => {
    const selectedDate = date;

    selectedDate.setHours(0);
    selectedDate.setMinutes(0);
    selectedDate.setSeconds(0);
    selectedDate.setMilliseconds(0);

    setDates((prev) => ({
      ...prev,
      [pickerType]: date,
      [`${pickerType}Modified`]: true,
    }));
  };

  const openDatePicker = (pickerType: DatePickerType) => {
    setOpenedDatePicker(pickerType);
  };

  const getMinMaxDateProps = (pickerType: DatePickerType) => {
    const datePickerProps = {
      maximumDate: new Date(),
      minimumDate: MIN_DATE,
    };

    if (pickerType === 'start') {
      if (dates.endModified) {
        datePickerProps.maximumDate = dates.end;
      }
    } else {
      if (dates.startModified) {
        datePickerProps.minimumDate = dates.start;
      }
    }

    return datePickerProps;
  };

  const renderDatePickerResetButton = (pickerType: DatePickerType) => {
    return (
      <TouchableOpacity
        accessibilityLabel={`Reset ${pickerType} date`}
        style={styles.pickerResetButton}
        onPress={() => resetDate(pickerType)}
      >
        <Icon name="close-circle-outline" size={24} />
      </TouchableOpacity>
    );
  };

  const renderDatePickerButton = (pickerType: DatePickerType) => (
    <TouchableOpacity
      accessibilityHint={`Pick ${pickerType} date`}
      onPress={() => openDatePicker(pickerType)}
    >
      <Txt style={styles.pickerText}>
        {dates[`${pickerType}Modified`]
          ? dates[pickerType].toLocaleDateString()
          : `${pickerType} date`}
      </Txt>
    </TouchableOpacity>
  );

  return (
    <Modalka
      contentStyle={styles.modalView}
      visible={visible}
      onClose={onClose}
    >
      <Txt style={styles.title}>Filters</Txt>
      <View style={[styles.section]}>
        <Txt style={styles.subTitle}>By date</Txt>
        <View style={styles.pickersContainer}>
          <View style={styles.pickerContainer}>
            {renderDatePickerButton('start')}
            {dates.startModified && renderDatePickerResetButton('start')}
          </View>
          <View>
            <Txt accessible={false}>–</Txt>
          </View>
          <View style={styles.pickerContainer}>
            {renderDatePickerButton('end')}
            {dates.endModified && renderDatePickerResetButton('end')}
          </View>
        </View>
        <DatePicker
          modal
          date={openedDatePicker === 'start' ? dates.start : dates.end}
          {...(openedDatePicker ? getMinMaxDateProps(openedDatePicker) : {})}
          mode="date"
          open={!!openedDatePicker}
          onCancel={() => setOpenedDatePicker(false)}
          onConfirm={(date) => {
            if (openedDatePicker) {
              setOpenedDatePicker(false);
              confirmDate(date, openedDatePicker);
            }
          }}
        />
      </View>
      <View style={styles.section}>
        <Txt style={styles.subTitle}>By categories</Txt>
        <View style={styles.chipsContainer}>
          {categoriesWithIds.map((category) => {
            const isSelected = categoryIds.includes(category.id);

            return (
              <TouchableOpacity
                key={category.id}
                aria-checked={isSelected}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() =>
                  setCategoryIds((prev) =>
                    isSelected
                      ? prev.filter((id) => id !== category.id)
                      : [...prev, category.id],
                  )
                }
              >
                <Txt style={styles.chipSelected}>{category.name}</Txt>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={buttonBase} onPress={onClose}>
          <Txt style={buttonBaseText}>Close</Txt>
        </TouchableOpacity>
        <TouchableOpacity style={buttonBase} onPress={handleApply}>
          <Txt style={buttonBaseText}>Apply</Txt>
        </TouchableOpacity>
      </View>
    </Modalka>
  );
}

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
  },
  chip: {
    borderColor: '#CECECE',
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  chipSelected: {
    borderColor: '#000',
  },
  chipText: {
    fontSize: 18,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  modalView: {
    width: '80%',
  },
  pickerContainer: {
    flexDirection: 'row',
  },
  pickerResetButton: {
    marginLeft: 10,
  },
  pickerText: {
    fontSize: 20,
    textDecorationLine: 'underline',
  },
  pickersContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  section: {
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 22,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});
