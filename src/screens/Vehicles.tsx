import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { AddNewVehicleCard } from '~/features/createNewVehicle';
import type { NavTypes } from '~/app/navigation';
import { card, screenPaddings } from '~/app/styles';
import { Txt } from '~/shared/components';

const DATA = [
  { title: 'Mom car', model: 'Mini Cooper' },
  { title: 'Work car', model: 'Toyota Corolla' },
  { title: 'My Car', model: 'BMW Series 1' },
];

export default function Vehicles(
  props: NavTypes.RootStackScreenProps<'Vehicles'>,
) {
  const { navigation } = props;

  return (
    <View style={styles.screen}>
      <AddNewVehicleCard />
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.title}
        renderItem={(obj) => (
          <View style={styles.listItem}>
            <Txt style={styles.listItemMainTxt}>{obj.item.title}</Txt>
            <Txt style={styles.listItemSecondaryTxt}>{obj.item.model}</Txt>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    ...card,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    width: '100%',
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
