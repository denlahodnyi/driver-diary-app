import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import PickerSelect from 'react-native-picker-select';
import { KeyboardAwareScrollView } from '@pietile-native-kit/keyboard-aware-scrollview';
import dayjs from 'dayjs';
import type { NavTypes } from '~/app/navigation';
import { buttonBase, buttonBaseText, screenPaddings } from '~/app/styles';
import {
  APP_MIN_DATE_STR,
  COMMENT_LENGTH,
  CURRENCY_CODE,
  LOCATION_LENGTH,
} from '~/app/constants';
import { useStorageString } from '~/app/storage';
import {
  CostInput,
  CurrencySelect,
  Icon,
  Input,
  Txt,
  maskCurrency,
} from '~/shared/components';
import { ActivityDeleteDecorator } from '~/features/activities/delete';
import { activityModel } from '~/entities/activity';
import { categoryLib } from '~/entities/category';
import type { Activity as ActivityModel } from 'db';

const MIN_DATE = new Date(APP_MIN_DATE_STR);
const DATE_FORMAT = 'DD MMM YYYY';

type Form = {
  comment: string;
  cost: string;
  currencyCode: string;
  date: Date;
  location: string;
  subcategoryId: string | null;
  subcategoryName: string;
};

export default function Activity(
  props: NavTypes.RootStackScreenProps<'Activity'>,
) {
  const { navigation, route } = props;
  const mode = route.params.mode;
  const activityId = mode !== 'create' ? route.params.activityId : null;
  const newCategoryId = mode !== 'view' ? route.params?.newCategoryId : null;

  const [vehicleId] = useStorageString('selectedVehicleId');
  const [userCurrencyCode] = useStorageString('currencyCode');
  const [activityData] = activityModel.useActivityById(activityId);
  const [createActivity] = activityModel.useCreateActivity();
  const [updateActivity] = activityModel.useUpdateActivity();

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [form, setForm] = useState<Form>({
    comment: '',
    cost: '0', // must be number of minor units
    currencyCode: userCurrencyCode || CURRENCY_CODE,
    date: new Date(),
    location: '',
    subcategoryId: null,
    subcategoryName: '',
  });

  const selectedCategory = useMemo(() => {
    const category = categoryLib.findCategoryById(
      newCategoryId || activityData?.categoryId || '',
    );

    return category
      ? {
          id: category.id,
          name: category.name,
          subcategories: category.subcategories.map((sub) => ({
            label: sub.name,
            value: sub.id,
          })),
        }
      : null;
  }, [newCategoryId, activityData?.categoryId]);

  const adaptRecordDataToForm = useCallback(
    (record: ActivityModel) => {
      return {
        comment: record.comment || '',
        cost: record.cost ? record.cost.toString() : '0',
        currencyCode: record.currencyCode || userCurrencyCode || CURRENCY_CODE,
        date: new Date(record.date),
        location: record.location || '',
        subcategoryId: record.subcategoryId || null,
        subcategoryName:
          record.subcategoryId && selectedCategory
            ? selectedCategory.subcategories.find(
                (sub) => sub.value === record.subcategoryId,
              )?.label || ''
            : '',
      };
    },
    [selectedCategory, userCurrencyCode],
  );

  const adaptFormDataToRecord = useCallback(
    (formData: Form) => ({
      ...formData,
      cost: Number(formData.cost),
      date: formData.date.valueOf(),
    }),
    [],
  );

  useEffect(
    function syncFormStateWithSavedData() {
      if (activityData) {
        setForm(adaptRecordDataToForm(activityData));
      }
    },
    [activityData, adaptRecordDataToForm],
  );

  const handleSave = async () => {
    if (vehicleId) {
      if (mode === 'create') {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { success } = await createActivity({
          ...adaptFormDataToRecord(form),
          categoryId: route.params.newCategoryId,
          vehicleId,
        });

        if (success) navigation.navigate('Activities', { screen: 'Feed' });
      } else if (mode === 'update' && activityData) {
        const id = route.params.activityId;
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { success } = await updateActivity({
          ...adaptFormDataToRecord(form),
          categoryId: route.params.newCategoryId || activityData.categoryId,
          id,
        });

        if (success) navigation.setParams({ mode: 'view' });
      }
    }
  };

  const handleCancel = () => {
    // reset possible changes
    if (activityData) setForm(adaptRecordDataToForm(activityData));
    // setParams merges params, so it's important to remove newCategoryId first
    navigation.setParams({ mode: 'update', newCategoryId: undefined });
    navigation.setParams({ mode: 'view' });
  };

  const handleCategoryChange = () => {
    navigation.navigate(
      'Categories',
      mode === 'update'
        ? { activityId: route.params.activityId, mode: 'update' }
        : { mode: 'create' },
    );
  };

  const handleSubcategoryChange = (value: string, index: number) => {
    if (selectedCategory) {
      setForm((prev) => ({
        ...prev,
        subcategoryId: index === 0 ? null : value,
        subcategoryName:
          index === 0 ? '' : selectedCategory.subcategories[index - 1].label,
      }));
    }
  };

  if (mode === 'create' || mode === 'update') {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={[screenPaddings, { flex: 1 }]}
      >
        <TouchableWithoutFeedback
          accessibilityHint="Press to change the category"
          onPress={handleCategoryChange}
        >
          <Txt style={[styles.title, styles.editableText]}>
            {selectedCategory?.name}
          </Txt>
        </TouchableWithoutFeedback>
        {selectedCategory && !!selectedCategory.subcategories.length && (
          <PickerSelect
            items={selectedCategory.subcategories}
            placeholder={{ label: 'Select subcategory', value: null }}
            style={{
              inputAndroid: [styles.subTitle, styles.editableText],
              inputIOS: [styles.subTitle, styles.editableText],
            }}
            value={form.subcategoryId}
            onValueChange={handleSubcategoryChange}
          />
        )}
        <View style={styles.section}>
          <TouchableWithoutFeedback
            accessibilityHint="Press to change the date"
            onPress={() => setIsDatePickerOpen(true)}
          >
            <Txt style={[styles.text, styles.editableText]}>
              {dayjs(form.date).format(DATE_FORMAT)}
            </Txt>
          </TouchableWithoutFeedback>
          <DatePicker
            modal
            date={form.date}
            maximumDate={new Date()}
            minimumDate={MIN_DATE}
            mode="date"
            open={isDatePickerOpen}
            onCancel={() => {
              setIsDatePickerOpen(false);
            }}
            onConfirm={(date) => {
              setIsDatePickerOpen(false);
              setForm((prev) => ({ ...prev, date }));
            }}
          />
        </View>
        <View style={[styles.section, { flexDirection: 'row', gap: 20 }]}>
          <CostInput
            containerProps={{ style: { flex: 1 } }}
            label="Cost"
            value={form.cost}
            onChangeText={(cost, rawCost) => {
              setForm((prev) => ({ ...prev, cost: rawCost }));
            }}
          />
          <CurrencySelect
            containerProps={{ style: { flex: 1 } }}
            label="Currency"
            placeholder={{}}
            value={form.currencyCode}
            onValueChange={(currencyCode) =>
              setForm((prev) => ({ ...prev, currencyCode }))
            }
          />
        </View>
        <View style={styles.section}>
          <Input
            containerProps={{
              style: { marginBottom: 0 },
            }}
            label="Location"
            maxLength={LOCATION_LENGTH}
            value={form.location}
            onChangeText={(location) =>
              setForm((prev) => ({ ...prev, location }))
            }
          />
        </View>
        <View style={styles.section}>
          <Input
            multiline
            containerProps={{
              style: { marginBottom: 0 },
            }}
            label="Comment"
            maxLength={COMMENT_LENGTH}
            style={styles.multilineInput}
            textAlignVertical="top"
            value={form.comment}
            onChangeText={(comment) =>
              setForm((prev) => ({ ...prev, comment }))
            }
          />
        </View>

        <View style={styles.actionsContainer}>
          {(mode === 'create' || mode === 'update') && (
            <TouchableWithoutFeedback
              style={styles.actionButton}
              onPress={handleSave}
            >
              <Txt style={styles.actionButtonText}>Save</Txt>
            </TouchableWithoutFeedback>
          )}
          {mode === 'update' && (
            <TouchableWithoutFeedback
              style={styles.actionButton}
              onPress={handleCancel}
            >
              <Txt style={styles.actionButtonText}>Cancel</Txt>
            </TouchableWithoutFeedback>
          )}
        </View>
      </KeyboardAwareScrollView>
    );
  }

  return (
    <View style={screenPaddings}>
      <Txt style={styles.title}>{selectedCategory?.name}</Txt>
      {form.subcategoryName && (
        <Txt style={styles.subTitle}>{form.subcategoryName}</Txt>
      )}
      <View style={[styles.section, { alignItems: 'center' }]}>
        <TouchableOpacity
          accessibilityLabel="Toggle bookmark"
          style={styles.bookmarkButton}
          onPress={() => {
            activityData?.toggleBookmark();
          }}
        >
          <Icon
            name={activityData?.isBookmark ? 'bookmark' : 'bookmark-outline'}
            size={50}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Txt style={styles.text}>{dayjs(form.date).format(DATE_FORMAT)}</Txt>
      </View>
      {Number(form.cost) > 0 && (
        <View style={styles.section}>
          <Txt style={[styles.text, styles.sectionLabel]}>Cost</Txt>
          <Txt style={styles.text}>
            {maskCurrency(form.cost, {
              currencyCode: form.currencyCode,
            })}
          </Txt>
        </View>
      )}
      {form.location && (
        <View style={styles.section}>
          <Txt style={[styles.text, styles.sectionLabel]}>Location</Txt>
          <Txt style={styles.text}>{form.location}</Txt>
        </View>
      )}
      {form.comment && (
        <View style={styles.section}>
          <Txt style={[styles.text, styles.sectionLabel]}>Comment</Txt>
          <Txt style={styles.text}>{form.comment}</Txt>
        </View>
      )}
      {mode === 'view' && activityData?.id && (
        <ActivityDeleteDecorator>
          {(handleDeleteActivity) => (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() =>
                handleDeleteActivity(activityData.id, undefined, () => {
                  navigation.navigate('Activities', { screen: 'Feed' });
                })
              }
            >
              <Txt style={styles.deleteButtonText}>Delete</Txt>
            </TouchableOpacity>
          )}
        </ActivityDeleteDecorator>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionButtonText: {
    fontSize: 30,
  },
  actionsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  bookmarkButton: {
    ...buttonBase,
  },
  deleteButton: {
    ...buttonBase,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: 12,
  },
  deleteButtonText: {
    ...buttonBaseText,
    color: 'red',
  },
  editableText: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
  multilineInput: {
    maxHeight: 200,
    minHeight: 100,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    color: 'grey',
  },
  subTitle: {
    fontSize: 30,
    marginBottom: 12,
  },
  text: {
    fontSize: 24,
  },
  title: {
    fontSize: 70,
    lineHeight: 70,
  },
});
