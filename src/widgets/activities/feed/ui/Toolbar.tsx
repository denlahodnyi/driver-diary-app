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

export type ToolbarViewType = 'timeline' | 'calendar';

type ToolbarProps = {
  canSort?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  onFiltersApply?: (filters: FiltersState) => void;
  onViewSwitch?: (type: ToolbarViewType) => void;
  selectedFilters?: FiltersState;
  viewSwitcherType?: ToolbarViewType;
};

type Toolbar = {
  ToolbarProps: ToolbarProps;
  ToolbarViewType: ToolbarViewType;
};

function Toolbar(props: ToolbarProps) {
  const {
    canSort,
    containerStyle,
    onFiltersApply,
    onViewSwitch,
    selectedFilters,
    viewSwitcherType,
  } = props;
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
        end: endDate,
        start: startDate,
      },
    };
  }, [selectedFilters]);

  const handleAddActivity = () => {
    navigation.navigate('Categories', { mode: 'create' });
  };

  const handleApplyFilters = (filters: ModalFiltersState) => {
    const { categoryIds, dates } = filters;

    setIsFilterModalOpen(false);
    if (onFiltersApply) {
      onFiltersApply({
        categoryIds,
        endDate: dates.end,
        startDate: dates.start,
      });
    }
  };

  const handleToggleSortSettings = () =>
    setIsFilterModalOpen(!isFilterModalOpen);

  const handleViewToggle = () => {
    if (onViewSwitch) {
      onViewSwitch(viewSwitcherType === 'calendar' ? 'timeline' : 'calendar');
    }
  };

  return (
    <View style={[styles.container, ...toArray(containerStyle)]}>
      <TouchableOpacity
        accessibilityLabel="Add new activity"
        onPress={handleAddActivity}
      >
        <Icon name="add" size={25} />
      </TouchableOpacity>
      <>
        <View style={styles.divider} />
        <TouchableOpacity
          accessibilityLabel="Toggle view"
          onPress={handleViewToggle}
        >
          <Icon
            name={
              viewSwitcherType === 'calendar'
                ? 'list-outline'
                : 'calendar-outline'
            }
            size={25}
          />
        </TouchableOpacity>
      </>
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
    marginHorizontal: 8,
  },
});
