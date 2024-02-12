import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NavTypes } from '~/app/navigation';
import { card, screenPaddings } from '~/app/styles';
import { HorizontalSwipeView, Icon, Txt } from '~/shared/components';
import { vehicleModel } from '~/entities/vehicle';

function Vehicles(props: NavTypes.RootStackScreenProps<'Vehicles'>) {
  const { navigation } = props;
  const [allVehicles] = vehicleModel.useVehicles();
  const [deleteVehicle] = vehicleModel.useDeleteVehicle();

  const handleDelete = (id: string, onCancel: () => void) => {
    Alert.alert('Confirm deletion', '', [
      {
        onPress: () => {
          deleteVehicle(id);
        },
        style: 'destructive',
        text: 'Confirm',
      },
      {
        onPress: onCancel,
        style: 'cancel',
        text: 'Cancel',
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={allVehicles}
        keyExtractor={(item) => item.id}
        renderItem={(obj) => (
          <View style={styles.listItemContainer}>
            <HorizontalSwipeView
              config={{
                isRightSwipeDisabled: true,
                rightSwipeShift: 148,
              }}
              renderRightElement={({ resetSwipedState }) => (
                <View style={styles.listItemActionsContainer}>
                  <TouchableOpacity
                    accessibilityLabel="Edit item"
                    style={styles.listItemActionButton}
                    onPress={() => {
                      resetSwipedState();
                      navigation.navigate('Vehicle', {
                        vehicleId: obj.item.id,
                      });
                    }}
                  >
                    <Icon name="pencil" size={40} />
                  </TouchableOpacity>
                  <View style={styles.divider} />
                  <TouchableOpacity
                    accessibilityLabel="Delete item"
                    style={styles.listItemActionButton}
                    onPress={() => {
                      handleDelete(obj.item.id, () => {
                        resetSwipedState();
                      });
                    }}
                  >
                    <Icon name="trash" size={40} />
                  </TouchableOpacity>
                </View>
              )}
              style={styles.listItem}
              onPress={() => {
                console.log(
                  'Navigate to ' + obj.item.title,
                  obj.item.createdAt,
                );
                navigation.navigate('Activities', { screen: 'Feed' });
              }}
            >
              <Txt style={styles.listItemMainTxt}>{obj.item.title}</Txt>
              <Txt style={styles.listItemSecondaryTxt}>{obj.item.model}</Txt>
            </HorizontalSwipeView>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    borderColor: '#CECECE',
    borderLeftWidth: 1,
    height: 60,
  },
  listItem: {
    ...card,
    paddingHorizontal: 14,
    paddingVertical: 12,
    width: '100%',
    zIndex: 10,
  },
  listItemActionButton: {
    padding: 10,
  },
  listItemActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    position: 'absolute',
    right: 0,
    zIndex: 5,
  },
  listItemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
    position: 'relative',
  },
  listItemMainTxt: {
    fontSize: 24,
    marginBottom: 12,
  },
  listItemSecondaryTxt: {
    fontSize: 18,
  },
  screen: {
    ...screenPaddings,
    flex: 1,
    gap: 22,
  },
});

export default Vehicles;
