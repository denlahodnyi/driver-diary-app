import { useEffect, useState } from 'react';
import { View } from 'react-native';
import type { NavTypes } from '~/app/navigation';
import { vehicleModel } from '~/entities/vehicle';
import { VehicleForm } from '~/features/vehicles/create';
import type { TError } from '~/shared/types';

type Form = {
  model: string;
  title: string;
};

const isFormField = (form: Form, field: string): field is keyof Form => {
  return Object.hasOwn(form, field);
};

export default function Vehicle(
  props: NavTypes.RootStackScreenProps<'Vehicle'>,
) {
  const { navigation, route } = props;
  const { vehicleId = null } = route.params || {};

  const [vehicle] = vehicleModel.useVehicleById(vehicleId);
  const [createVehicle, { error: creationError }] =
    vehicleModel.useCreateVehicle();
  const [updateVehicle, { error: updateError }] =
    vehicleModel.useUpdateVehicle();
  const [form, setForm] = useState<Form>({ model: '', title: '' });

  const adaptErrors = (error: TError) => {
    const result: Form = { model: '', title: '' };

    if (error?.errors) {
      error.errors.forEach((o) => {
        if (o.field && isFormField(result, o.field)) {
          result[o.field] = Array.isArray(o.message) ? o.message[0] : o.message;
        }
      });
    }
    return result;
  };

  const adaptedErrors = adaptErrors(vehicleId ? updateError : creationError);

  useEffect(
    function fillFormWithSavedVehicle() {
      if (vehicle) {
        setForm({ model: vehicle.model, title: vehicle.title });
      }
    },
    [vehicle],
  );

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    let result;

    if (vehicleId) {
      result = await updateVehicle({ id: vehicleId, ...form });
    } else {
      result = await createVehicle(form);
    }

    if (result?.success) {
      navigation.goBack();
    }
  };

  return (
    <View>
      <VehicleForm
        data={form}
        error={adaptedErrors}
        onCancel={() => {
          navigation.goBack();
        }}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </View>
  );
}
