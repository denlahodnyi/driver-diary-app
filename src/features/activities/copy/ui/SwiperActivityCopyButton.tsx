import { SwiperActionButton } from '~/shared/components';
import ActivityDeleteDecorator from './ActivityCopyDecorator';

type SwiperActivityCopyButtonProps = {
  afterAction?: () => void;
  beforeAction?: () => void;
  activityId: string;
  categoryId: string;
} & Omit<SwiperActionButton['Props'], 'iconName'>;

export default function SwiperActivityCopyButton(
  props: SwiperActivityCopyButtonProps,
) {
  const { activityId, afterAction, beforeAction, categoryId, ...rest } = props;

  return (
    <ActivityDeleteDecorator>
      {(duplicate) => (
        <SwiperActionButton
          {...rest}
          accessibilityLabel="Copy activity"
          iconName="copy"
          onPress={() => {
            if (beforeAction) beforeAction();
            duplicate(activityId, categoryId);
            if (afterAction) afterAction();
          }}
        />
      )}
    </ActivityDeleteDecorator>
  );
}
