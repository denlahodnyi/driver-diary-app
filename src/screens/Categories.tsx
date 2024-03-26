import { TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { screenPaddings } from '~/app/styles';
import { Txt } from '~/shared/components';
import type { NavTypes } from '~/app/navigation';
import { categoriesWithIds } from 'db/data';

const sorted = categoriesWithIds.sort((a, b) => (a.name > b.name ? 1 : -1));

function Categories(props: NavTypes.RootStackScreenProps<'Categories'>) {
  const { navigation, route } = props;
  const mode = route.params.mode;
  const { styles } = useStyles(stylesheet);

  return (
    <View style={screenPaddings}>
      {sorted.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={styles.listItem}
          onPress={() => {
            navigation.navigate({
              merge: true,
              name: 'Activity',
              params:
                mode === 'create'
                  ? { mode, newCategoryId: category.id }
                  : {
                      activityId: route.params.activityId,
                      mode,
                      newCategoryId: category.id,
                    },
            });
          }}
        >
          <Txt style={styles.listItemTitle}>{category.name}</Txt>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default Categories;

const stylesheet = createStyleSheet((theme) => ({
  listItem: {
    borderBottomWidth: 1,
    borderColor: theme.colors.grey[200],
    paddingVertical: 10,
  },
  listItemTitle: {
    fontSize: 22,
  },
}));
