import { StyleSheet, View } from 'react-native';
import { Button, Input } from '~/shared/components';

type FormKeys = 'model' | 'title';

type VehicleFormProps = {
  data: {
    [key in FormKeys]: string;
  };
  error: {
    [key in FormKeys]: string;
  };
  onCancel: () => void;
  onChange: (key: FormKeys, value: string) => void;
  onSubmit: () => void;
};

export default function VehicleForm(props: VehicleFormProps) {
  const { data, error, onCancel, onChange, onSubmit } = props;

  return (
    <View style={styles.form}>
      <Input
        aria-labelledby="formLabel_title"
        enterKeyHint="next"
        error={error.title}
        label="Title:"
        labelProps={{ nativeID: 'formLabel_title' }}
        value={data.title}
        onChangeText={(title) => onChange('title', title)}
      />
      <Input
        aria-labelledby="formLabel_model"
        enterKeyHint="done"
        error={error.model}
        label="Model:"
        labelProps={{ nativeID: 'formLabel_model' }}
        value={data.model}
        onChangeText={(model) => onChange('model', model)}
      />
      <View style={styles.formButtons}>
        <Button isPrimary onPress={onSubmit}>
          Save
        </Button>
        <Button isSecondary variant="text" onPress={onCancel}>
          Cancel
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: 8,
    paddingVertical: 14,
    width: '100%',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
});
