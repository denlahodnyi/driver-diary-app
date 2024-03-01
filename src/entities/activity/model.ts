import { useState } from 'react';
import { catchError, defer, iif, map, of, switchMap } from 'rxjs';
import { bind } from '@react-rxjs/core';
import { storage } from '~/app/storage';
import {
  COMMENT_LENGTH,
  GENERAL_ERROR_MESSAGE,
  LOCATION_LENGTH,
} from '~/app/constants';
import { buildActionHookResult, formatError } from '~/shared/utils';
import type { ActionHookReturn, TError } from '~/shared/types';
import { ValidationError } from '~/shared/classes';
import { type Activity, Database, type Vehicle } from 'db';
import { getVehicleById } from '../vehicle/model';

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

const [useObservedActivities] = bind(
  defer(() => {
    const vehicleId = storage.getString('selectedVehicleId');

    if (!vehicleId) {
      throw new Error('No selected vehicle found');
    }

    return db.get<Vehicle>('vehicles').find(vehicleId);
  }).pipe(
    switchMap((vehicle) =>
      vehicle.activities.observe().pipe(map((data) => ({ data, error: null }))),
    ),
    catchError((error: Error) =>
      of({
        data: null,
        error: error instanceof Error ? error.message : error,
      }),
    ),
  ),
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
  const { data, error } = useObservedActivities();

  return [data, { error }] as const;
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
    date,
    location,
    subcategoryId,
    vehicleId,
  }: {
    comment?: Activity['comment'];
    cost?: Activity['cost'];
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
    date,
    id,
    isBookmark,
    location,
    subcategoryId,
  }: {
    categoryId?: Activity['categoryId'];
    comment?: Activity['comment'];
    cost?: Activity['cost'];
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
  useActivities,
  useActivityById,
  useCreateActivity,
  useUpdateActivity,
  useDeleteActivity,
};
