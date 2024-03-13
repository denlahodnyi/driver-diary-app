import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { buttonBase, buttonBaseText } from '~/app/styles';
import {
  Modalka,
  RangeDatePicker,
  type RangeDatePickerProps,
  Txt,
} from '~/shared/components';
import { categoriesWithIds } from 'db/data';

export type ActivitiesFiltersModalProps = {
  onApplyFilters?: (o: FiltersState) => void;
  selectedFilters?: FiltersState;
  onClose: () => void;
  visible: boolean;
};
export type DatesState = {
  end: Date | null;
  start: Date | null;
};
export type FiltersState = {
  categoryIds: string[];
  dates: DatesState;
};

export default function ActivitiesFiltersModal(
  props: ActivitiesFiltersModalProps,
) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { onApplyFilters, onClose, selectedFilters, visible } = props;

  const [dates, setDates] = useState<DatesState>({
    end: null,
    start: null,
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

  const onDateConfirm = (
    confirmedDates: Parameters<RangeDatePickerProps['onConfirm']>[0],
  ) => {
    setDates(confirmedDates);
  };

  return (
    <Modalka
      contentStyle={styles.modalView}
      visible={visible}
      onClose={onClose}
    >
      <Txt style={styles.title}>Filters</Txt>
      <View style={[styles.section]}>
        <Txt style={styles.subTitle}>By date</Txt>
        <RangeDatePicker dates={dates} onConfirm={onDateConfirm} />
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
