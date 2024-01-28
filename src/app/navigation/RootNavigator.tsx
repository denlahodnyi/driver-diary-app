import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Bookmarks, Feed, Settings, Stats, Vehicles } from '~/screens';
import { HeaderSettingsLink } from '~/widgets/navigation';
import type { ActivitiesTabsParamsList, RootStackParamsList } from './types';

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamsList>();
const Tab = createBottomTabNavigator<ActivitiesTabsParamsList>();

function ActivitiesNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen component={Feed} name="Feed" />
      <Tab.Screen component={Bookmarks} name="Bookmarks" />
      <Tab.Screen component={Stats} name="Stats" />
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
