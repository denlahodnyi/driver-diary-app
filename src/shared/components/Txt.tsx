import { StyleSheet, Text, type TextProps } from 'react-native';

export type TxtProps = TextProps;

export default function Txt(props: TxtProps) {
  const { children, ...rest } = props;

  return <Text {...rest}>{children}</Text>;
}

const styles = StyleSheet.create({});
