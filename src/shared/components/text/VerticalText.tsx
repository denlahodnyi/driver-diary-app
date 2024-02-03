import { type StyleProp, StyleSheet, type TextStyle, View } from 'react-native';
import Txt, { type TxtProps } from '../text/Txt';

export type VerticalTextProps = {
  children: string;
  style: StyleProp<TextStyle>;
} & TxtProps;

export default function VerticalText(props: VerticalTextProps) {
  const { children, style, ...rest } = props;

  return (
    <View style={styles.wrapper}>
      {children.split('').map((symbol, index) => (
        <Txt key={index} style={[style, { lineHeight: 24 }]} {...rest}>
          {symbol}
        </Txt>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
  },
});
