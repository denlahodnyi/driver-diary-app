import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Input, Txt } from '~/shared/components';
import { buttonBase, buttonBaseText, card } from '~/app/styles';

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
        label="Title"
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
        <TouchableOpacity style={buttonBase} onPress={onSubmit}>
          <Txt style={buttonBaseText}>Save</Txt>
        </TouchableOpacity>
        <TouchableOpacity style={buttonBase} onPress={onCancel}>
          <Txt style={buttonBaseText}>Cancel</Txt>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    ...card,
    paddingHorizontal: 8,
    paddingVertical: 14,
    width: '100%',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  toggleButton: {
    ...card,
    paddingVertical: 50,
    width: '100%',
  },
  toggleButton__text: {
    fontSize: 24,
    textAlign: 'center',
  },
});
