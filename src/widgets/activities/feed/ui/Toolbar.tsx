import { useMemo, useState } from 'react';
import {
  type StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '~/shared/components';
import { toArray } from '~/shared/utils';
import {
  ActivitiesFiltersModal,
  type FiltersState as ModalFiltersState,
} from '~/features/activities/sort';

type FiltersState = {
  categoryIds: string[];
  endDate: null | Date;
  startDate: null | Date;
};

type ToolbarProps = {
  canSort?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  onFiltersApply?: (filters: FiltersState) => void;
  selectedFilters?: FiltersState;
};

function Toolbar(props: ToolbarProps) {
  const { canSort, containerStyle, onFiltersApply, selectedFilters } = props;
  const navigation = useNavigation();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const modalFiltersFromProp = useMemo<ModalFiltersState>(() => {
    const { categoryIds, endDate, startDate } = selectedFilters || {
      categoryIds: [],
      endDate: null,
      startDate: null,
    };

    return {
      categoryIds,
      dates: {
        end: endDate || new Date(),
        endModified: !!endDate,
        start: startDate || new Date(),
        startModified: !!startDate,
      },
    };
  }, [selectedFilters]);

  const handleAddActivity = () => {
    navigation.navigate('Categories', { mode: 'create' });
  };

  const handleApplyFilters = (filters: ModalFiltersState) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { end, endModified, start, startModified } = filters.dates;
    const { categoryIds } = filters;

    setIsFilterModalOpen(false);
    if (onFiltersApply) {
      onFiltersApply({
        categoryIds,
        endDate: endModified ? end : null,
        startDate: startModified ? start : null,
      });
    }
  };

  const handleToggleSortSettings = () =>
    setIsFilterModalOpen(!isFilterModalOpen);

  return (
    <View style={[styles.container, ...toArray(containerStyle)]}>
      <TouchableOpacity
        accessibilityLabel="Add new activity"
        onPress={handleAddActivity}
      >
        <Icon name="add" size={25} />
      </TouchableOpacity>
      {canSort && (
        <>
          <View style={styles.divider} />
          <TouchableOpacity
            accessibilityLabel="Show sorting settings"
            onPress={handleToggleSortSettings}
          >
            <Icon name="options" size={25} />
          </TouchableOpacity>
          <ActivitiesFiltersModal
            selectedFilters={modalFiltersFromProp}
            visible={isFilterModalOpen}
            onApplyFilters={handleApplyFilters}
            onClose={() => setIsFilterModalOpen(false)}
          />
        </>
      )}
    </View>
  );
}

export default Toolbar;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    backgroundColor: '#FFF',
    borderRadius: 10,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  divider: {
    borderColor: '#CECECE',
    borderLeftWidth: 1,
    height: '100%',
    marginHorizontal: 6,
  },
});
