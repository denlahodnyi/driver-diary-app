type MainStackParamsList = {
  Settings: undefined;
  Vehicles: undefined;
};

declare module 'AppTypes/navigation' {
  import type { NativeStackScreenProps } from '@react-navigation/native-stack';
  import type { ParamListBase } from '@react-navigation/native';

  type StackScreensMappedProps<TStackParamsList extends ParamListBase> = {
    [RouteName in keyof TStackParamsList]: NativeStackScreenProps<
      TStackParamsList,
      RouteName
    >;
  };

  export type MainStackScreensMappedProps =
    StackScreensMappedProps<MainStackParamsList>;
}
