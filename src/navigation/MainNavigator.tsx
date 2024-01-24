import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Bookmarks, Feed, Settings, Stats, Vehicles } from './screens';

const { Navigator, Screen } = createNativeStackNavigator<MainStackParamsList>();
const Tab = createBottomTabNavigator();

function ActivitiesNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen component={Feed} name="Feed" />
      <Tab.Screen component={Bookmarks} name="Bookmarks" />
      <Tab.Screen component={Stats} name="Stats" />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Navigator>
      <>
        <Screen
          component={Vehicles}
          name="Vehicles"
          options={{ title: 'Vehicles' }}
        />
        <Screen
          component={Settings}
          name="Settings"
          options={{ title: 'Settings' }}
        />
        <Screen
          component={ActivitiesNavigator}
          name="Activities"
          options={{ headerShown: false }}
        />
      </>
    </Navigator>
  );
}
