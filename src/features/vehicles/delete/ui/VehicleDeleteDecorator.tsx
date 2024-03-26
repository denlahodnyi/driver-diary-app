import { Alert } from 'react-native';
import { vehicleModel } from '~/entities/vehicle';

type DeleteFn = (
  vehicleId: string,
  onCancel?: () => void,
  onSuccess?: () => void,
) => void;

type VehicleDeleteDecoratorProps = {
  children: (deleteFn: DeleteFn) => React.ReactNode;
};

export default function VehicleDeleteDecorator(
  props: VehicleDeleteDecoratorProps,
) {
  const { children } = props;
  const [deleteVehicle] = vehicleModel.useDeleteVehicle();

  const handleDeleteVehicle: DeleteFn = (
    vehicleId,
    onCancel,
    onSuccess?: () => void,
  ) => {
    Alert.alert('Confirm deletion', '', [
      {
        onPress: async () => {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          const { success } = await deleteVehicle(vehicleId);

          if (success && onSuccess) onSuccess();
        },
        style: 'destructive',
        text: 'Confirm',
      },
      {
        onPress: onCancel,
        style: 'cancel',
        text: 'Cancel',
      },
    ]);
  };

  return <>{children(handleDeleteVehicle)}</>;
}
