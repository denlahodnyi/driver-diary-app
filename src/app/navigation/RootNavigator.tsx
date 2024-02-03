import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Bookmarks, Feed, Settings, Stats, Vehicles } from '~/screens';
import { HeaderSettingsLink, HeaderVehiclesLink } from '~/widgets/navigation';
import { Icon } from '~/shared/components';
import type { ActivitiesTabsParamsList, RootStackParamsList } from './types';

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
          tabBarIcon: () => <Icon name="bookmark" size={30} />,
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
  return (
    <Navigator>
      <>
        <Screen
          component={Vehicles}
          name="Vehicles"
          options={{
            headerRight: () => <HeaderSettingsLink />,
            title: 'Vehicles',
          }}
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
      </>
    </Navigator>
  );
}
