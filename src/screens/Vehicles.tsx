import { FlatList, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import type { NavTypes } from '~/app/navigation';
import {
  listItem,
  screenPaddings,
  swipableListItemLastActionButton,
} from '~/app/styles';
import { HorizontalSwiper, Txt } from '~/shared/components';
import { vehicleModel } from '~/entities/vehicle';
import { VehicleDeleteDecorator } from '~/features/vehicles/delete';

function Vehicles(props: NavTypes.RootStackScreenProps<'Vehicles'>) {
  const { navigation } = props;
  const { styles, theme } = useStyles(stylesheet);
  const [allVehicles] = vehicleModel.useVehicles();

  const handleNavigateToVehicle = (vehicle: (typeof allVehicles)[number]) => {
    vehicleModel.saveVehicleIdToStorage(vehicle.id);
    navigation.navigate('Activities', { screen: 'Feed' });
  };

  return (
    <View style={styles.screen}>
      <VehicleDeleteDecorator>
        {(handleDelete) => (
          <FlatList
            data={allVehicles}
            keyExtractor={(item) => item.id}
            renderItem={(obj) => (
              <HorizontalSwiper
                HorizontalSwipeViewProps={{
                  config: {
                    isRightSwipeDisabled: true,
                  },
                  onPress: () => handleNavigateToVehicle(obj.item),
                }}
                lastActionButtonStyle={swipableListItemLastActionButton(theme, {
                  isFirst: obj.index === 0,
                  isLast: obj.index === allVehicles.length - 1,
                })}
                rightActions={['update', 'delete']}
                onDelete={() => {
                  handleDelete(obj.item.id);
                }}
                onUpdate={() => {
                  navigation.navigate('Vehicle', {
                    vehicleId: obj.item.id,
                  });
                }}
              >
                <View
                  style={listItem(theme, {
                    isFirst: obj.index === 0,
                    isLast: obj.index === allVehicles.length - 1,
                  })}
                >
                  <Txt fontWeight="extraBold" style={styles.listItemMainTxt}>
                    {obj.item.title}
                  </Txt>
                  <Txt style={styles.listItemSecondaryTxt}>
                    {obj.item.model}
                  </Txt>
                </View>
              </HorizontalSwiper>
            )}
          />
        )}
      </VehicleDeleteDecorator>
    </View>
  );
}

const stylesheet = createStyleSheet(() => ({
  listItemMainTxt: {
    fontSize: 24,
    marginBottom: 10,
  },
  listItemSecondaryTxt: {
    fontSize: 18,
  },
  screen: {
    ...screenPaddings,
    flex: 1,
    gap: 22,
  },
}));

export default Vehicles;
