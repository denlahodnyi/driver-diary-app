import { useEffect, useState } from 'react';
import {
  type StyleProp,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import DatePicker, { type DatePickerProps } from 'react-native-date-picker';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import dayjs from 'dayjs';
import { APP_MIN_DATE_STR } from '~/app/constants';
import { toArray } from '~/shared/utils';
import Txt from '../text/Txt';
import Icon from '../Icon';

const MIN_DATE = new Date(APP_MIN_DATE_STR);

export type ConfirmParam = {
  end: Date | null;
  start: Date | null;
};

export type RangeDatePickerProps = {
  dates?: ConfirmParam;
  endDate?: ConfirmParam['end'];
  mode?: DatePickerProps['mode'];
  pickerContainerStyle?: StyleProp<ViewStyle>;
  startDate?: ConfirmParam['start'];
  onConfirm: (o: ConfirmParam) => void;
};
type DatePickerType = 'start' | 'end';

export type DatesState = {
  end: Date;
  endModified: boolean;
  start: Date;
  startModified: boolean;
};

export default function RangeDatePicker(props: RangeDatePickerProps) {
  const {
    dates: externalDates,
    mode = 'date',
    onConfirm,
    pickerContainerStyle,
  } = props;
  const { styles, theme } = useStyles(stylesheet);

  const [openedDatePicker, setOpenedDatePicker] = useState<
    false | DatePickerType
  >(false);
  const [dates, setDates] = useState<DatesState>({
    end: new Date(),
    endModified: false,
    start: new Date(),
    startModified: false,
  });

  useEffect(() => {
    if (externalDates) {
      setDates({
        end: externalDates.end || new Date(),
        endModified: !!externalDates.end,
        start: externalDates.start || new Date(),
        startModified: !!externalDates.start,
      });
    }
  }, [externalDates]);

  const openDatePicker = (pickerType: DatePickerType) => {
    setOpenedDatePicker(pickerType);
  };

  const resetDate = (pickerType: DatePickerType) => {
    setDates((prev) => ({
      ...prev,
      [pickerType]: new Date(),
      [`${pickerType}Modified`]: false,
    }));

    if (pickerType === 'start') {
      onConfirm({
        end: dates.endModified ? dates.end : null,
        start: null,
      });
    } else {
      onConfirm({
        end: null,
        start: dates.startModified ? dates.start : null,
      });
    }
  };

  const confirmDate = (date: Date, pickerType: DatePickerType) => {
    const selectedDate = date;

    if (mode === 'date') {
      selectedDate.setHours(0);
      selectedDate.setMinutes(0);
      selectedDate.setSeconds(0);
      selectedDate.setMilliseconds(0);
    }

    setDates((prev) => ({
      ...prev,
      [pickerType]: date,
      [`${pickerType}Modified`]: true,
    }));

    if (pickerType === 'start') {
      onConfirm({
        end: dates.endModified ? dates.end : null,
        start: date,
      });
    } else {
      onConfirm({
        end: date,
        start: dates.startModified ? dates.start : null,
      });
    }
  };

  const getMinMaxDateProps = (pickerType: DatePickerType) => {
    const datePickerProps = {
      maximumDate: new Date(),
      minimumDate: MIN_DATE,
    };

    if (pickerType === 'start') {
      if (dates.endModified) {
        datePickerProps.maximumDate = dates.end;
      }
    } else {
      if (dates.startModified) {
        datePickerProps.minimumDate = dates.start;
      }
    }

    return datePickerProps;
  };

  const renderDatePickerResetButton = (pickerType: DatePickerType) => {
    return (
      <TouchableOpacity
        accessibilityLabel={`Reset ${pickerType} date`}
        style={styles.pickerResetButton}
        onPress={() => resetDate(pickerType)}
      >
        <Icon
          color={theme.colors.primary.default}
          name="close-circle-outline"
          size={24}
        />
      </TouchableOpacity>
    );
  };

  const renderDatePickerButton = (pickerType: DatePickerType) => (
    <TouchableOpacity
      accessibilityHint={`Pick ${pickerType} date`}
      onPress={() => openDatePicker(pickerType)}
    >
      <Txt style={styles.pickerText}>
        {dates[`${pickerType}Modified`]
          ? dayjs(dates[pickerType]).format('DD MMM YYYY')
          : 'Press to select'}
      </Txt>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={[styles.pickersContainer, ...toArray(pickerContainerStyle)]}>
        <View style={styles.pickerContainer}>
          <Txt style={styles.pickerLabel}>Start date:</Txt>
          <View style={styles.pickerActionsContainer}>
            {renderDatePickerButton('start')}
            {dates.startModified && renderDatePickerResetButton('start')}
          </View>
        </View>
        <View style={[styles.pickerContainer, styles.pickerContainerDivided]}>
          <Txt style={styles.pickerLabel}>End date:</Txt>
          <View style={styles.pickerActionsContainer}>
            {renderDatePickerButton('end')}
            {dates.endModified && renderDatePickerResetButton('end')}
          </View>
        </View>
      </View>
      <DatePicker
        modal
        date={openedDatePicker === 'start' ? dates.start : dates.end}
        {...(openedDatePicker ? getMinMaxDateProps(openedDatePicker) : {})}
        mode="date"
        open={!!openedDatePicker}
        onCancel={() => setOpenedDatePicker(false)}
        onConfirm={(date) => {
          if (openedDatePicker) {
            setOpenedDatePicker(false);
            confirmDate(date, openedDatePicker);
          }
        }}
      />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  pickerActionsContainer: {
    flexDirection: 'row',
  },
  pickerContainer: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  pickerContainerDivided: {
    borderColor: theme.colors.secondary.default,
    borderLeftWidth: 1,
  },
  pickerLabel: {
    color: theme.colors.text.secondary,
  },
  pickerResetButton: {
    marginLeft: 10,
  },
  pickerText: {
    fontSize: 18,
  },
  pickersContainer: {
    alignItems: 'center',
    borderColor: theme.colors.secondary.default,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
  },
}));
