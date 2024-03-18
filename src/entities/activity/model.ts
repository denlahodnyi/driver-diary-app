import { useState } from 'react';
import { Q } from '@nozbe/watermelondb';
import { catchError, iif, map, of, switchMap } from 'rxjs';
import { bind } from '@react-rxjs/core';
import { groupBy } from 'lodash';
import dayjs from 'dayjs';
import { storage, useStorageString } from '~/app/storage';
import {
  COMMENT_LENGTH,
  CURRENCY_CODE,
  CURRENCY_MINOR_UNITS,
  GENERAL_ERROR_MESSAGE,
  LOCATION_LENGTH,
} from '~/app/constants';
import { buildActionHookResult, formatError } from '~/shared/utils';
import type { ActionHookReturn, TError } from '~/shared/types';
import { ValidationError } from '~/shared/classes';
import { type Activity, Database, type Vehicle } from 'db';
import { getVehicleById } from '../vehicle/model';
import { categoryLib } from '../category';

const db = Database.getInstance();

function validate(data: {
  comment?: Activity['comment'];
  cost?: Activity['cost'];
  location?: Activity['location'];
}) {
  if (data.comment && data.comment.length > COMMENT_LENGTH) {
    throw new ValidationError('`comment` is too long', {
      field: 'comment',
      message: `Must have less than ${COMMENT_LENGTH} characters`,
    });
  }
  if (data.location && data.location.length > LOCATION_LENGTH) {
    throw new ValidationError('`location` is too long', {
      field: 'location',
      message: `Must have less than ${LOCATION_LENGTH} characters`,
    });
  }
}

async function getActivities() {
  return await db.get<Activity>('activities').query().fetch();
}

async function getActivityById(id: string) {
  return await db.get<Activity>('activities').find(id);
}

type CostReportDataItem = {
  currencyCode: string;
  day: string;
  hours: string;
  month: string;
  totalCost: number;
  totalCostConverted: number;
  year: string;
};
type CostReport = {
  byCurrencyCode: Record<string, CostReportDataItem[]>;
  currencyCodes: string[];
};

const yearColumnName = 'year';
const monthColumnName = 'month';
const dayColumnName = 'day';
const hoursColumnName = 'hours';

const getSqlDatePartColumnForSelect = (
  datePart: 'year' | 'month' | 'day' | 'hours',
) => {
  let formatStr = '%Y';
  let columnName = yearColumnName;

  switch (datePart) {
    case 'month': {
      formatStr = '%m';
      columnName = monthColumnName;
      break;
    }
    case 'day': {
      formatStr = '%d';
      columnName = dayColumnName;
      break;
    }
    case 'hours': {
      formatStr = '%H';
      columnName = hoursColumnName;
      break;
    }
    default:
      break;
  }
  return `strftime('${formatStr}', datetime(date / 1000, 'unixepoch')) AS ${columnName}`;
};

async function getCostAnalysis(options?: {
  categoryIds: string[];
  dateEnd: Date | null;
  dateStart: Date | null;
}): Promise<CostReport | undefined> {
  const { categoryIds, dateEnd, dateStart } = options || {
    categoryIds: [],
    dateEnd: null,
    dateStart: null,
  };
  const vehicleId = storage.getString('selectedVehicleId');

  if (vehicleId) {
    const start = dateStart;
    const end = dateStart ? dateEnd || new Date() : dateEnd || null;
    const yearColumn = getSqlDatePartColumnForSelect('year');
    let monthColumn = getSqlDatePartColumnForSelect('month');
    let dayColumn = getSqlDatePartColumnForSelect('day');
    let hoursColumn = getSqlDatePartColumnForSelect('hours');

    if (start && end) {
      if (dayjs(end).diff(start, 'years') >= 3) {
        // select only year column
        monthColumn = `NULL AS ${monthColumnName}`;
        dayColumn = `NULL AS ${dayColumnName}`;
        hoursColumn = `NULL AS ${hoursColumnName}`;
      } else if (dayjs(end).diff(start, 'months') > 1) {
        // select only year and month columns
        dayColumn = `NULL AS ${dayColumnName}`;
        hoursColumn = `NULL AS ${hoursColumnName}`;
      } else if (dayjs(end).diff(start, 'days') > 3) {
        // select only year, month and day columns
        hoursColumn = `NULL AS ${hoursColumnName}`;
      }
    } else {
      monthColumn = `NULL AS ${monthColumnName}`;
      dayColumn = `NULL AS ${dayColumnName}`;
      hoursColumn = `NULL AS ${hoursColumnName}`;
    }

    const columnsToSelect = [yearColumn, monthColumn, dayColumn, hoursColumn];
    const columnsToGroupBy = [yearColumnName];

    if (!monthColumn.includes('NULL')) {
      columnsToGroupBy.push(monthColumnName);
    }
    if (!dayColumn.includes('NULL')) {
      columnsToGroupBy.push(dayColumnName);
    }
    if (!hoursColumn.includes('NULL')) {
      columnsToGroupBy.push(hoursColumnName);
    }

    let datesFilterCondition = '';

    if (start && end) {
      datesFilterCondition = `AND "date" BETWEEN ${start.valueOf()} AND ${end.valueOf()}`;
    } else if (end) {
      datesFilterCondition = `AND "date" <= ${end.valueOf()}`;
    }

    let categoryFilterCondition = '';

    if (categoryIds.length) {
      const ids = categoryIds.map((id) => `"${id}"`).join(',');

      categoryFilterCondition = `AND category_id IN (${ids})`;
    }

    const query = db.get<Activity>('activities').query(
      Q.unsafeSqlQuery(
        `SELECT ${columnsToSelect.join(', ')},
                SUM(cost) AS totalCost,
                SUM(cost) / ${CURRENCY_MINOR_UNITS} AS totalCostConverted,
                currency_code AS currencyCode
          FROM activities
          WHERE vehicle_id = ?
                AND cost > 0
                ${datesFilterCondition}
                ${categoryFilterCondition}
          GROUP BY
          currencyCode,
          ${columnsToGroupBy.join(', ')}`,
        [vehicleId],
      ),
    );

    const result: CostReportDataItem[] = await query.unsafeFetchRaw();
    const grouped = groupBy(result, (o) => o.currencyCode);

    return { byCurrencyCode: grouped, currencyCodes: Object.keys(grouped) };
  }
}

type CategoriesReportDataItem = {
  categoryId: string;
  total: number;
};
type CategoriesReport = (CategoriesReportDataItem & {
  categoryName: string | null;
})[];

async function getCategoriesAnalysis(options?: {
  categoryIds: string[];
  dateEnd: Date | null;
  dateStart: Date | null;
}): Promise<CategoriesReport | undefined> {
  const {
    categoryIds,
    dateEnd: end,
    dateStart: start,
  } = options || {
    categoryIds: [],
    dateEnd: null,
    dateStart: null,
  };
  const vehicleId = storage.getString('selectedVehicleId');

  let datesFilterCondition = '';

  if (start && end) {
    datesFilterCondition = `"date" BETWEEN ${start.valueOf()} AND ${end.valueOf()}`;
  } else if (end) {
    datesFilterCondition = `"date" <= ${end.valueOf()}`;
  } else if (start) {
    datesFilterCondition = `"date" >= ${start.valueOf()}`;
  }

  let categoryFilterCondition = '';

  if (categoryIds.length) {
    const ids = categoryIds.map((id) => `"${id}"`).join(',');

    categoryFilterCondition = `category_id IN (${ids})`;
  }

  if (vehicleId) {
    const query = db.get<Activity>('activities').query(
      Q.unsafeSqlQuery(
        `SELECT category_id AS categoryId, COUNT(category_id) AS total
          FROM activities
          WHERE vehicle_id = ?
          ${
            datesFilterCondition || categoryFilterCondition
              ? `AND ${datesFilterCondition} ${
                  categoryFilterCondition && datesFilterCondition
                    ? `AND ${categoryFilterCondition}`
                    : categoryFilterCondition
                }`
              : ''
          }
          GROUP BY categoryId
          ORDER BY total DESC`,
        [vehicleId],
      ),
    );

    const result: CategoriesReportDataItem[] = await query.unsafeFetchRaw();

    return result.map((c) => ({
      ...c,
      categoryName: categoryLib.findCategoryById(c.categoryId)?.name || null,
    }));
  }
}

type ActivitiesOptions = {
  categoryIds: string[];
  endDate: null | Date;
  startDate: null | Date;
};

const [useObservedActivities] = bind(
  (vehicleId: string | null, options: ActivitiesOptions) => {
    return iif(
      () => !!vehicleId,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      db.get<Vehicle>('vehicles').findAndObserve(vehicleId!),
      of(null),
    ).pipe(
      switchMap((vehicle) => {
        const { categoryIds, endDate, startDate } = options;

        if (!vehicle) return of(null);

        let query = vehicle.sortedActivities;

        if (startDate) {
          query = query.extend(Q.where('date', Q.gt(startDate.valueOf())));
        }
        if (endDate) {
          query = query.extend(Q.where('date', Q.lt(endDate.valueOf())));
        }
        if (categoryIds.length) {
          query = query.extend(Q.where('category_id', Q.oneOf(categoryIds)));
        }
        return query.observeWithColumns([
          'is_bookmark',
          'date',
          'category_id',
          'subcategory_id',
        ]);
      }),
      map((data) => ({ data, error: null })),
      catchError((error: Error) =>
        of({
          data: null,
          error: error instanceof Error ? error.message : error,
        }),
      ),
    );
  },
  { data: [], error: null },
);

const [useObservedActivity] = bind(
  (activityId: string | null) => {
    return iif(
      () => !!activityId,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      db.get<Activity>('activities').findAndObserve(activityId!),
      of(null),
    ).pipe(
      map((data) => ({ data, error: null })),
      catchError((error: Error) =>
        of({
          data: null,
          error: error instanceof Error ? error.message : error,
        }),
      ),
    );
  },
  { data: null, error: null },
);

function useActivities() {
  const [options, setOptions] = useState<ActivitiesOptions>({
    categoryIds: [],
    endDate: null,
    startDate: null,
  });
  const [vehicleId] = useStorageString('selectedVehicleId');
  const { data, error } = useObservedActivities(vehicleId || null, options);

  return [data, { error, options, setOptions }] as const;
}

function useActivityById(activityId: string | null) {
  const { data, error } = useObservedActivity(activityId);

  return [data, { error }] as const;
}

function useCreateActivity() {
  const [error, setError] = useState<TError>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createActivity = async ({
    categoryId,
    comment,
    cost,
    currencyCode,
    date,
    location,
    subcategoryId,
    vehicleId,
  }: {
    comment?: Activity['comment'];
    cost?: Activity['cost'];
    currencyCode?: Activity['currencyCode'];
    location?: Activity['location'];
    subcategoryId?: Activity['subcategoryId'];
    categoryId: Activity['categoryId'];
    date: Activity['date'];
    vehicleId: Vehicle['id'];
  }) => {
    try {
      validate({ comment, cost, location });
      setIsLoading(true);
      setError(null);

      const data = await db.write(async () => {
        const vehicle = await getVehicleById(vehicleId);

        return await db.get<Activity>('activities').create((record) => {
          record.comment = comment || null;
          record.date = date;
          record.categoryId = categoryId;
          record.subcategoryId = subcategoryId || null;
          record.location = location || null;
          record.cost = cost || null;
          record.currencyCode = currencyCode || CURRENCY_CODE;
          record.isBookmark = false;
          record.vehicles.set(vehicle);
        });
      });

      return buildActionHookResult({ data });
    } catch (err) {
      console.error(err);
      const formattedError = formatError(
        err instanceof Error ? err : GENERAL_ERROR_MESSAGE,
      );

      setError(formattedError);

      return buildActionHookResult({ error: formattedError });
    } finally {
      setIsLoading(false);
    }
  };

  return [createActivity, { error, isLoading }] satisfies ActionHookReturn;
}

function useUpdateActivity() {
  const [error, setError] = useState<TError>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateActivity = async ({
    categoryId,
    comment,
    cost,
    currencyCode,
    date,
    id,
    isBookmark,
    location,
    subcategoryId,
  }: {
    categoryId?: Activity['categoryId'];
    comment?: Activity['comment'];
    cost?: Activity['cost'];
    currencyCode?: Activity['currencyCode'];
    date?: Activity['date'];
    isBookmark?: Activity['isBookmark'];
    location?: Activity['location'];
    subcategoryId?: Activity['subcategoryId'];
    id: Activity['id'];
  }) => {
    try {
      validate({ comment, cost, location });
      setIsLoading(true);
      setError(null);

      const data = await db.write(async () => {
        const activity = await db.get<Activity>('activities').find(id);

        return await activity.update((record) => {
          record.comment = comment == null ? record.comment : comment;
          record.date = date || record.date;
          record.categoryId = categoryId || record.categoryId;
          record.cost = cost || record.cost;
          record.currencyCode = currencyCode || record.currencyCode;
          record.location = location == null ? record.location : location;
          record.isBookmark = isBookmark || record.isBookmark;
          record.subcategoryId =
            subcategoryId == null ? record.subcategoryId : subcategoryId;
        });
      });

      return buildActionHookResult({ data });
    } catch (err) {
      console.error(err);
      const formattedError = formatError(
        err instanceof Error ? err : GENERAL_ERROR_MESSAGE,
      );

      setError(formattedError);

      return buildActionHookResult({ error: formattedError });
    } finally {
      setIsLoading(false);
    }
  };

  return [updateActivity, { error, isLoading }] satisfies ActionHookReturn;
}

function useDeleteActivity() {
  const [error, setError] = useState<TError>(null);
  const [isLoading, setIsLoading] = useState(false);

  const deleteActivity = async (activityId: Activity['id']) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await db.write(async () => {
        const activity = await db.get<Activity>('activities').find(activityId);

        return await activity.destroyPermanently();
      });

      return buildActionHookResult({ data });
    } catch (err) {
      console.error(err);
      const formattedError = formatError(
        err instanceof Error ? err : GENERAL_ERROR_MESSAGE,
      );

      setError(formattedError);

      return buildActionHookResult({ error: formattedError });
    } finally {
      setIsLoading(false);
    }
  };

  return [deleteActivity, { error, isLoading }] satisfies ActionHookReturn;
}

export {
  getActivities,
  getActivityById,
  getCategoriesAnalysis,
  getCostAnalysis,
  useActivities,
  useActivityById,
  useCreateActivity,
  useUpdateActivity,
  useDeleteActivity,
  type CostReport,
  type CostReportDataItem,
  type CategoriesReport,
  type CategoriesReportDataItem,
};
