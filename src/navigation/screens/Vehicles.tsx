import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { type MainStackScreensMappedProps } from 'AppTypes/navigation';

export default function Vehicles(
  props: MainStackScreensMappedProps['Vehicles'],
) {
  const { navigation } = props;

  return (
    <View>
      <Text>Vehicles</Text>
      <Pressable onPress={() => navigation.navigate('Activities')}>
        <Text>PRESS</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({});
