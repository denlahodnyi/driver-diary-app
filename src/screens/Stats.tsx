import { TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { type NavTypes } from '~/app/navigation';
import { screenPaddings } from '~/app/styles';
import { Txt } from '~/shared/components';

export default function Stats(props: NavTypes.ActivitiesScreenProps<'Stats'>) {
  const { navigation } = props;
  const { styles } = useStyles(stylesheet);

  return (
    <View style={screenPaddings}>
      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate('ExpenditureStats')}
      >
        <Txt style={styles.linkText}>Analyze expenditures</Txt>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate('ActivitiesStats')}
      >
        <Txt style={styles.linkText}>Analyze activities</Txt>
      </TouchableOpacity>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  link: {
    borderBottomWidth: 1,
    borderColor: theme.colors.grey[200],
    paddingVertical: 10,
  },
  linkText: {
    fontSize: 22,
  },
}));
