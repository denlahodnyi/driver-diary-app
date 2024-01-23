import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { type MainStackScreensMappedProps } from 'AppTypes/navigation';

export default function Vehicles(
  props: MainStackScreensMappedProps['Vehicles'],
) {
  const { navigation } = props;

  return (
    <View>
      <Text>Vehicles</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
