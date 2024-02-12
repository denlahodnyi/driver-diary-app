import type {
  CompositeScreenProps,
  NavigatorScreenParams,
  ParamListBase,
} from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackParamsList = {
  Activities: NavigatorScreenParams<ActivitiesTabsParamsList>;
  Settings: undefined;
  Vehicle: { vehicleId: string } | undefined;
  Vehicles: undefined;
};

export type ActivitiesTabsParamsList = {
  Bookmarks: undefined;
  Feed: undefined;
  Stats: undefined;
};

type StackScreensMappedProps<TStackParamsList extends ParamListBase> = {
  [RouteName in keyof TStackParamsList]: NativeStackScreenProps<
    TStackParamsList,
    RouteName
  >;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/consistent-type-definitions
    interface RootParamList extends RootStackParamsList {}
  }
}

// mapped props for all RootStack screens
export type RootStackScreensMappedProps =
  StackScreensMappedProps<RootStackParamsList>;

// props for single RootStack screen
export type RootStackScreenProps<
  TRootStackRouteName extends keyof RootStackParamsList,
> = NativeStackScreenProps<RootStackParamsList, TRootStackRouteName>;

// props for single ActivitiesTab screen
export type ActivitiesScreenProps<
  TActivityTabRouteName extends keyof ActivitiesTabsParamsList,
> = CompositeScreenProps<
  BottomTabScreenProps<ActivitiesTabsParamsList, TActivityTabRouteName>,
  RootStackScreenProps<keyof RootStackParamsList>
>;
