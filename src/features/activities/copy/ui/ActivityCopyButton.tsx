import { TouchableOpacity, type TouchableOpacityProps } from 'react-native';
import { useStyles } from 'react-native-unistyles';
import { Icon } from '~/shared/components';
import ActivityDeleteDecorator from './ActivityCopyDecorator';

type ActivityCopyButtonProps = {
  activityId: string;
  categoryId: string;
} & TouchableOpacityProps;

export default function ActivityCopyButton(props: ActivityCopyButtonProps) {
  const { activityId, categoryId, onPress, ...rest } = props;
  const { theme } = useStyles();

  return (
    <ActivityDeleteDecorator>
      {(duplicate) => (
        <TouchableOpacity
          accessibilityLabel="Copy activity"
          onPress={(e) => {
            duplicate(activityId, categoryId);
            if (onPress) onPress(e);
          }}
          {...rest}
        >
          <Icon
            color={theme.colors.primary.default}
            name="copy-outline"
            size={50}
          />
        </TouchableOpacity>
      )}
    </ActivityDeleteDecorator>
  );
}
