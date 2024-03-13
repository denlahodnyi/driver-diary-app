import { SafeAreaView } from 'react-native';

export default (props: { children: React.ReactNode }) => {
  const { children } = props;

  return <SafeAreaView>{children}</SafeAreaView>;
};
