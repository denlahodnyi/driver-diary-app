import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { screenPaddings } from '~/app/styles';
import { Txt } from '~/shared/components';
import type { RootStackScreenProps } from '~/app/navigation/types';
import { categoriesWithIds } from 'db/data';

const sorted = categoriesWithIds.sort((a, b) => (a.name > b.name ? 1 : -1));

function Categories(props: RootStackScreenProps<'Categories'>) {
  const { navigation, route } = props;
  const mode = route.params.mode;

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

const styles = StyleSheet.create({
  listItem: {
    borderBottomWidth: 1,
    borderColor: 'grey',
    paddingVertical: 6,
  },
  listItemTitle: {
    fontSize: 20,
  },
});
