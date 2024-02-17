import { createStackNavigator } from '@react-navigation/stack';

const createNativeStackNavigator = () => {
  const Stack = createStackNavigator();

  return {
    ...Stack,
    Navigator: (props) => (
      <Stack.Navigator
        {...props}
        headerMode="none"
        screenOptions={{ animationEnabled: false }}
      />
    ),
  };
};

export { createNativeStackNavigator };
