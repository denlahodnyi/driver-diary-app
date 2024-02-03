import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Input, Txt } from '~/shared/components';
import { buttonBase, buttonBaseText, card } from '~/app/styles';

export default function AddNewVehicleCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    model: '',
    title: '',
    type: 'car',
  });

  if (isOpen) {
    return (
      <View style={styles.form}>
        <Input
          aria-labelledby="formLabel_title"
          enterKeyHint="next"
          label="Title"
          labelProps={{ nativeID: 'formLabel_title' }}
          value={form.title}
          onChangeText={(title) => setForm((prev) => ({ ...prev, title }))}
        />
        <Input
          aria-labelledby="formLabel_model"
          enterKeyHint="done"
          label="Model:"
          labelProps={{ nativeID: 'formLabel_model' }}
          value={form.model}
          onChangeText={(model) => setForm((prev) => ({ ...prev, model }))}
        />
        <View style={styles.formButtons}>
          <TouchableOpacity style={buttonBase}>
            <Txt style={buttonBaseText}>Save</Txt>
          </TouchableOpacity>
          <TouchableOpacity
            style={[buttonBase]}
            onPress={() => setIsOpen(false)}
          >
            <Txt style={buttonBaseText}>Cancel</Txt>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.toggleButton}
      onPress={() => setIsOpen(true)}
    >
      <Txt style={styles.toggleButton__text}>Press here to add new vehicle</Txt>
    </TouchableOpacity>
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
