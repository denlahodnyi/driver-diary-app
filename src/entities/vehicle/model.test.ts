import { renderHook, waitFor } from '@testing-library/react-native';
import { Database } from 'db';
import {
  useCreateVehicle,
  useDeleteVehicle,
  useUpdateVehicle,
  useVehicleById,
} from './model';

const db = Database.getInstance();

jest.mock('db');

describe('useCreateVehicle()', () => {
  it('returns correct initial result', () => {
    const { result } = renderHook(() => useCreateVehicle());
    const [f, { error, isLoading }] = result.current;

    expect(f).toBeFunction();
    expect(isLoading).toBeFalse();
    expect(error).toBeNull();
  });

  describe('creation function', () => {
    it('returns error when model is not provided', async () => {
      const { result } = renderHook(() => useCreateVehicle());
      const [f] = result.current;

      const callResult = await waitFor(async () => {
        return await f({ model: '', title: 'test-title' });
      });
      const [_, { error }] = result.current;

      expect(callResult.success).toBeFalse();
      expect(callResult.error).toBe(error);
      expect(error?.errors?.[0].field).toBe('model');
    });
    it('returns error when title is not provided', async () => {
      const { result } = renderHook(() => useCreateVehicle());
      const [f] = result.current;

      const callResult = await waitFor(async () => {
        return await f({ model: 'test-model', title: '' });
      });
      const [_, { error }] = result.current;

      expect(callResult.success).toBeFalse();
      expect(callResult.error).toBe(error);
      expect(error?.errors?.[0].field).toBe('title');
    });
    it('returns data on success', async () => {
      const fakeData = { model: 'foo', title: 'bar' };

      (db.write as jest.Mock).mockResolvedValue(fakeData);

      const { result } = renderHook(() => useCreateVehicle());
      const [f] = result.current;

      const callResult = await waitFor(async () => {
        return await f(fakeData);
      });

      expect(callResult.success).toBeTrue();
      expect(callResult.data).toBe(fakeData);
    });
  });
});

describe('useUpdateVehicle()', () => {
  it('returns correct initial result', () => {
    const { result } = renderHook(() => useUpdateVehicle());
    const [f, { error, isLoading }] = result.current;

    expect(f).toBeFunction();
    expect(isLoading).toBeFalse();
    expect(error).toBeNull();
  });

  describe('update function', () => {
    it('returns error when model is not provided', async () => {
      const { result } = renderHook(() => useUpdateVehicle());
      const [f] = result.current;

      const callResult = await waitFor(async () => {
        return await f({ id: 'xyz', model: '', title: 'test-title' });
      });
      const [_, { error }] = result.current;

      expect(callResult.success).toBeFalse();
      expect(callResult.error).toBe(error);
      expect(error?.errors?.[0].field).toBe('model');
    });
    it('returns error when title is not provided', async () => {
      const { result } = renderHook(() => useUpdateVehicle());
      const [f] = result.current;

      const callResult = await waitFor(async () => {
        return await f({ id: 'xyz', model: 'test-model', title: '' });
      });
      const [_, { error }] = result.current;

      expect(callResult.success).toBeFalse();
      expect(callResult.error).toBe(error);
      expect(error?.errors?.[0].field).toBe('title');
    });
    it('returns data on success', async () => {
      const fakeData = { id: 'xyz', model: 'foo', title: 'bar' };

      (db.write as jest.Mock).mockResolvedValue(fakeData);

      const { result } = renderHook(() => useUpdateVehicle());
      const [f] = result.current;

      const callResult = await waitFor(async () => {
        return await f(fakeData);
      });

      expect(callResult.success).toBeTrue();
      expect(callResult.data).toBe(fakeData);
    });
  });
});

describe('useDeleteVehicle()', () => {
  it('returns correct initial result', () => {
    const { result } = renderHook(() => useDeleteVehicle());
    const [f, { error, isLoading }] = result.current;

    expect(f).toBeFunction();
    expect(isLoading).toBeFalse();
    expect(error).toBeNull();
  });

  describe('delete function', () => {
    it('returns error when title is not provided', async () => {
      (db.write as jest.Mock).mockRejectedValue(new Error('No record'));

      const { result } = renderHook(() => useDeleteVehicle());
      const [f] = result.current;

      const callResult = await waitFor(async () => {
        return await f('xyz');
      });
      const [_, { error }] = result.current;

      expect(callResult.success).toBeFalse();
      expect(callResult.error).toBe(error);
    });
    it('returns success after delete', async () => {
      const { result } = renderHook(() => useDeleteVehicle());
      const [f] = result.current;

      const callResult = await waitFor(async () => {
        return await f('xyz');
      });

      expect(callResult.success).toBeTrue();
      expect(callResult.data).toBeNull();
    });
  });
});

describe('useVehicleById()', () => {
  it('returns data on success', async () => {
    const fakeData = { id: 'xyz', model: 'foo', title: 'bar' };

    (db.get as jest.Mock).mockImplementation(() => ({
      find: jest.fn().mockResolvedValue(fakeData),
    }));

    const { result } = renderHook(() => {
      const [data, { error, isLoading }] = useVehicleById('xyz');

      return { data, error, isLoading };
    });

    // Delay is important for updating hook's state
    await new Promise<void>((resolve): void => {
      setTimeout(resolve, 500);
    });

    const { data, error, isLoading } = result.current;

    expect(data).toBe(fakeData);
    expect(isLoading).toBeFalse();
    expect(error).toBeNull();
  });
  it('returns error on failure', async () => {
    const fakeErrorMessage = 'not found';

    (db.get as jest.Mock).mockImplementation(() => ({
      find: jest.fn().mockRejectedValue(new Error(fakeErrorMessage)),
    }));

    const { result } = renderHook(() => useVehicleById('xyz'));

    // Delay is important for updating hook's state
    await new Promise<void>((resolve): void => {
      setTimeout(resolve, 500);
    });

    const [data, { error, isLoading }] = result.current;

    expect(data).toBeNull();
    expect(isLoading).toBeFalse();
    expect(error?.message).toBe(fakeErrorMessage);
  });
});
