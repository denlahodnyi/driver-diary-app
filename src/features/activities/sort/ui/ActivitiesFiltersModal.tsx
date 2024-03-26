import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import {
  Button,
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
  const { styles } = useStyles(stylesheet);

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
      <Txt fontWeight="medium" style={styles.title}>
        Filters
      </Txt>
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
              <Button
                key={category.id}
                isSecondary
                aria-checked={isSelected}
                variant={isSelected ? 'filled' : 'outlined'}
                onPress={() =>
                  setCategoryIds((prev) =>
                    isSelected
                      ? prev.filter((id) => id !== category.id)
                      : [...prev, category.id],
                  )
                }
              >
                {category.name}
              </Button>
            );
          })}
        </View>
      </View>
      <View style={styles.actionsContainer}>
        <Button isPrimary onPress={handleApply}>
          Apply
        </Button>
        <Button isSecondary variant="text" onPress={onClose}>
          Close
        </Button>
      </View>
    </Modalka>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  actionsContainer: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  modalView: {
    width: '90%',
  },
  section: {
    marginBottom: 20,
  },
  subTitle: {
    color: theme.colors.text.secondary,
    fontSize: 22,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
}));
