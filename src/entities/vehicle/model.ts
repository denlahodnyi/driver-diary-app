import { useEffect, useState } from 'react';
import { catchError, iif, map, of } from 'rxjs';
import { bind } from '@react-rxjs/core';
import { ValidationError } from '~/shared/classes';
import { buildActionHookResult, formatError } from '~/shared/utils';
import type { ActionHookReturn, DataHookReturn, TError } from '~/shared/types';
import { storage, useStorageString } from '~/app/storage';
import { GENERAL_ERROR_MESSAGE } from '~/app/constants';
import { Database, type Vehicle } from 'db';

const db = Database.getInstance();

const [useObservedVehicles, vehicles$] = bind(
  // Use observeWithColumns to allow query refresh after record update
  db.get<Vehicle>('vehicles').query().observeWithColumns(['model', 'title']),
  [],
);

function validate(data: { model: string; title: string }) {
  if (!data.model) {
    throw new ValidationError('`model` must not be empty', {
      field: 'model',
      message: 'Should not be empty',
    });
  }
  if (!data.title) {
    throw new ValidationError('`title` must not be empty', {
      field: 'title',
      message: 'Should not be empty',
    });
  }
}

async function getVehicles() {
  return await db.get<Vehicle>('vehicles').query().fetch();
}

async function getVehicleById(id: string) {
  return await db.get<Vehicle>('vehicles').find(id);
}

function saveVehicleIdToStorage(vehicleId: Vehicle['id']) {
  storage.set('selectedVehicleId', vehicleId);
}

function getSavedVehicleId() {
  const savedVehicle = storage.getString('selectedVehicleId');

  return savedVehicle ? JSON.parse(savedVehicle) : null;
}

const [useObservedVehicle] = bind(
  (vehicleId: string | null) => {
    return iif(
      () => !!vehicleId,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      db.get<Vehicle>('vehicles').findAndObserve(vehicleId!),
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

function useVehicles() {
  const data = useObservedVehicles();

  return [data] as const;
}

function useCurrentVehicle() {
  // ! useStorageString is not reactive
  const [vehicleId] = useStorageString('selectedVehicleId');
  const { data, error } = useObservedVehicle(vehicleId || null);

  return [data, { error }] as const;
}

function useVehicleById(id: string | null) {
  // TODO: make it reactive
  const [vehicle, setVehicle] = useState<null | Vehicle>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<TError>(null);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          setIsLoading(true);
          setError(null);

          const record = await getVehicleById(id);

          setVehicle(record);
        } catch (err) {
          console.error(err);

          if (err instanceof Error) {
            setError({ errors: null, message: err.message });
          }
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [id]);

  return [
    vehicle,
    { error, isLoading },
  ] satisfies DataHookReturn<null | Vehicle>;
}

function useCreateVehicle() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<TError>(null);

  const createFunc = async ({
    model,
    title,
  }: {
    model: Vehicle['model'];
    title: Vehicle['title'];
  }) => {
    try {
      validate({ model, title });
      setIsLoading(true);
      setError(null);

      const newRecord = await db.write(() => {
        return db.get<Vehicle>('vehicles').create((record) => {
          record.title = title;
          record.model = model;
        });
      });

      return buildActionHookResult({ data: newRecord });
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

  return [createFunc, { error, isLoading }] satisfies ActionHookReturn;
}

function useDeleteVehicle() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<TError>(null);

  const deleteFunc = async (id: Vehicle['id']) => {
    try {
      setIsLoading(true);
      setError(null);

      await db.write(async () => {
        const record = await db.get('vehicles').find(id);

        return record.destroyPermanently();
      });

      return buildActionHookResult({ data: null });
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

  return [deleteFunc, { error, isLoading }] satisfies ActionHookReturn;
}

function useUpdateVehicle() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<TError>(null);

  const updateFunc = async ({
    id,
    model,
    title,
  }: {
    id: string;
    model: string;
    title: string;
  }) => {
    try {
      validate({ model, title });
      setIsLoading(true);
      setError(null);

      const updatedRecord = await db.write(async () => {
        const vehicle = await db.get<Vehicle>('vehicles').find(id);

        const updated = await vehicle.update((record) => {
          record.title = title;
          record.model = model;
        });

        return updated;
      });

      return buildActionHookResult({ data: updatedRecord });
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

  return [updateFunc, { error, isLoading }] satisfies ActionHookReturn;
}

export {
  getVehicles,
  getVehicleById,
  getSavedVehicleId,
  saveVehicleIdToStorage,
  useCurrentVehicle,
  useCreateVehicle,
  useDeleteVehicle,
  useUpdateVehicle,
  useVehicles,
  useVehicleById,
  vehicles$,
};
