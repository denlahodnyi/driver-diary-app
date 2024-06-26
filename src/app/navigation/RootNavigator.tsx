/* eslint-disable react/no-unstable-nested-components */
import { View } from 'react-native';
import {
  type NativeStackHeaderProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {
  type BottomTabHeaderProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { type Theme, useTheme } from '@react-navigation/native';
import {
  ActivitiesStats,
  Activity,
  Bookmarks,
  Categories,
  ExpenditureStats,
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
import { appFonts } from '../styles';

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamsList>();
const Tab = createBottomTabNavigator<ActivitiesTabsParamsList>();

type SharedScreenOptions = BottomTabHeaderProps['options'] &
  NativeStackHeaderProps['options'];

const commonScreenOptions: SharedScreenOptions = {
  headerTitleAlign: 'center',
  headerTitleStyle: {
    fontFamily: appFonts.Poppins.medium,
    fontSize: 20,
  },
};

const getTabIconColor = (isFocused: boolean, navigatorTheme: Theme) =>
  isFocused ? '#000' : navigatorTheme.colors.text;

function ActivitiesNavigator() {
  const navigatorTheme = useTheme();

  return (
    <Tab.Navigator
      backBehavior="none"
      initialRouteName="Feed"
      screenOptions={{
        ...commonScreenOptions,
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
          tabBarIcon: ({ focused }) => (
            <Icon
              color={getTabIconColor(focused, navigatorTheme)}
              name="list"
              size={30}
            />
          ),
        }}
      />
      <Tab.Screen
        component={Bookmarks}
        name="Bookmarks"
        options={{
          tabBarAccessibilityLabel: 'Bookmarks',
          tabBarIcon: ({ focused }) => (
            <Icon
              color={getTabIconColor(focused, navigatorTheme)}
              name="bookmarks"
              size={30}
            />
          ),
        }}
      />
      <Tab.Screen
        component={Stats}
        name="Stats"
        options={{
          tabBarAccessibilityLabel: 'Statistics',
          tabBarIcon: ({ focused }) => (
            <Icon
              color={getTabIconColor(focused, navigatorTheme)}
              name="pie-chart"
              size={30}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const [selectedVehicleId] = useStorageString('selectedVehicleId');

  return (
    <Navigator
      initialRouteName={selectedVehicleId ? 'Activities' : 'Vehicles'}
      screenOptions={commonScreenOptions}
    >
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
        options={{
          headerBackTitleVisible: false,
          title: 'Select category',
        }}
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
      <Screen
        component={ExpenditureStats}
        name="ExpenditureStats"
        options={{ headerBackTitleVisible: false, headerTitle: '' }}
      />
      <Screen
        component={ActivitiesStats}
        name="ActivitiesStats"
        options={{ headerBackTitleVisible: false, headerTitle: '' }}
      />
    </Navigator>
  );
}
