import { useState } from 'react';
import { View } from 'react-native';
import { screenPaddings } from '~/app/styles';
import CategoriesSelect from './CategoriesSelect';

export default {
  'Multiple values': () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [categories, setCategories] = useState<string[]>([]);

    return (
      <View style={screenPaddings}>
        <CategoriesSelect
          isMultiple
          label="Categories"
          value={categories}
          onChange={(values) => {
            console.log('onChange', values);
            if (Array.isArray(values)) setCategories(values);
          }}
        />
      </View>
    );
  },
  // eslint-disable-next-line sort-keys
  'Single value': () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [categories, setCategories] = useState<string>();

    return (
      <View style={screenPaddings}>
        <CategoriesSelect
          label="Categories"
          value={categories}
          onChange={(values) => {
            console.log('onChange', values);
            if (!Array.isArray(values)) setCategories(values);
          }}
        />
      </View>
    );
  },
};
