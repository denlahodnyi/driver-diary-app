/* eslint-disable react/no-unstable-nested-components */
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Activity,
  Bookmarks,
  Categories,
  Feed,
  Settings,
  Stats,
  Vehicle,
  Vehicles,
} from '~/screens';
import {
  HeaderActivityEditBtn,
  HeaderNewVehicleLink,
  HeaderSettingsLink,
  HeaderVehiclesLink,
} from '~/widgets/navigation';
import { Icon } from '~/shared/components';
import type { ActivitiesTabsParamsList, RootStackParamsList } from './types';
import { useStorageString } from '../storage';

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamsList>();
const Tab = createBottomTabNavigator<ActivitiesTabsParamsList>();

function ActivitiesNavigator() {
  return (
    <Tab.Navigator
      backBehavior="none"
      initialRouteName="Feed"
      screenOptions={{
        headerLeft: () => (
          <View style={{ paddingLeft: 10 }}>
            <HeaderVehiclesLink />
          </View>
        ),
        headerRight: () => (
          <View style={{ paddingRight: 10 }}>
            <HeaderSettingsLink />
          </View>
        ),
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        component={Feed}
        name="Feed"
        options={{
          tabBarAccessibilityLabel: 'Feed',
          tabBarIcon: () => <Icon name="list" size={30} />,
        }}
      />
      <Tab.Screen
        component={Bookmarks}
        name="Bookmarks"
        options={{
          tabBarAccessibilityLabel: 'Bookmarks',
          tabBarIcon: () => <Icon name="bookmarks" size={30} />,
        }}
      />
      <Tab.Screen
        component={Stats}
        name="Stats"
        options={{
          tabBarAccessibilityLabel: 'Statistics',
          tabBarIcon: () => <Icon name="pie-chart" size={30} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const [selectedVehicleId] = useStorageString('selectedVehicleId');

  return (
    <Navigator initialRouteName={selectedVehicleId ? 'Activities' : 'Vehicles'}>
      <>
        <Screen
          component={Vehicles}
          name="Vehicles"
          options={{
            headerLeft: () => <HeaderNewVehicleLink />,
            headerRight: () => <HeaderSettingsLink />,
            title: 'Vehicles',
          }}
        />
        <Screen
          component={Vehicle}
          name="Vehicle"
          options={({ route }) => ({
            presentation: 'formSheet',
            title: route.params?.vehicleId
              ? 'Edit vehicle'
              : 'Create new vehicle',
          })}
        />
        <Screen
          component={Settings}
          name="Settings"
          options={{
            headerBackTitleVisible: false,
            title: 'Settings',
          }}
        />
        <Screen
          component={ActivitiesNavigator}
          name="Activities"
          options={{ headerShown: false }}
        />
        <Screen
          component={Categories}
          name="Categories"
          options={{ headerBackTitleVisible: false, title: 'Select category' }}
        />
        <Screen
          component={Activity}
          name="Activity"
          options={({ route }) => ({
            headerBackTitleVisible: false,
            headerRight: () =>
              route.params.mode === 'view' ? <HeaderActivityEditBtn /> : null,
          })}
        />
      </>
    </Navigator>
  );
}
