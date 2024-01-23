import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Vehicles } from './screens';

const { Navigator, Screen } = createNativeStackNavigator<MainStackParamsList>();

export default function MainNavigator() {
  return (
    <Navigator>
      <Screen
        component={Vehicles}
        name="Vehicles"
        options={{ title: 'Vehicles' }}
      />
    </Navigator>
  );
}
