import { useNavigation } from '@react-navigation/native';

type DuplicateFn = (activityId: string, categoryId: string) => void;

type ActivityCopyDecoratorProps = {
  children: (fn: DuplicateFn) => React.ReactNode;
};

export default function ActivityDuplicateCopy(
  props: ActivityCopyDecoratorProps,
) {
  const navigation = useNavigation();

  const handleCopy: DuplicateFn = (activityId, categoryId) => {
    navigation.navigate('Activity', {
      copiedActivityId: activityId,
      mode: 'create',
      newCategoryId: categoryId,
    });
  };

  return <>{props.children(handleCopy)}</>;
}
