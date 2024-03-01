import { Alert } from 'react-native';
import { activityModel } from '~/entities/activity';

type DeleteFn = (
  activityId: string,
  onCancel?: () => void,
  onSuccess?: () => void,
) => void;

type ActivityDeleteDecoratorProps = {
  children: (deleteFn: DeleteFn) => React.ReactNode;
};

export default function ActivityDeleteDecorator(
  props: ActivityDeleteDecoratorProps,
) {
  const { children } = props;
  const [deleteActivity] = activityModel.useDeleteActivity();

  const handleDeleteActivity: DeleteFn = (
    activityId,
    onCancel,
    onSuccess?: () => void,
  ) => {
    Alert.alert('Confirm deletion', '', [
      {
        onPress: async () => {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          const { success } = await deleteActivity(activityId);

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

  return <>{children(handleDeleteActivity)}</>;
}
