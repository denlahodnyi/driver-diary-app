import { renderHook, waitFor } from '@testing-library/react-native';
import { Observable } from 'rxjs';
import { COMMENT_LENGTH, LOCATION_LENGTH } from '~/app/constants';
import { Database } from 'db';
import {
  useActivityById,
  useCreateActivity,
  useDeleteActivity,
  useUpdateActivity,
} from './model';

const db = Database.getInstance();

jest.mock('db');

describe('useCreateActivity()', () => {
  it('returns correct initial result', () => {
    const { result } = renderHook(() => useCreateActivity());
    const [f, { error, isLoading }] = result.current;

    expect(f).toBeFunction();
    expect(isLoading).toBeFalse();
    expect(error).toBeNull();
  });

  describe('creation function', () => {
    it('returns error when "comment" is too long', async () => {
      const { result } = renderHook(() => useCreateActivity());
      const [f] = result.current;

      const callResult = await waitFor(async () => {
        let comment = 'Test comment ';

        comment = comment.repeat(
          Math.floor(COMMENT_LENGTH / comment.length) + 1,
        );

        return await f({
          categoryId: 'test-category-id',
          comment,
          date: new Date().valueOf(),
          vehicleId: 'test-vehicle-id',
        });
      });
      const [_, { error }] = result.current;

      expect(callResult.success).toBeFalse();
      expect(callResult.error).toBe(error);
      expect(error?.errors?.[0].field).toBe('comment');
    });
    it('returns error when "location" is too long', async () => {
      const { result } = renderHook(() => useCreateActivity());
      const [f] = result.current;

      const callResult = await waitFor(async () => {
        let location = 'Test location ';

        location = location.repeat(
          Math.floor(LOCATION_LENGTH / location.length) + 1,
        );

        return await f({
          categoryId: 'test-category-id',
          date: new Date().valueOf(),
          location,
          vehicleId: 'test-vehicle-id',
        });
      });
      const [_, { error }] = result.current;

      expect(callResult.success).toBeFalse();
      expect(callResult.error).toBe(error);
      expect(error?.errors?.[0].field).toBe('location');
    });
    it('returns data on success', async () => {
      const fakeData = {
        categoryId: 'test-category-id',
        comment: 'Lorem ipsum dolor sit amet',
        cost: 77700,
        date: new Date().valueOf(),
        location: 'New York',
        subcategoryId: 'test-subcategory-id',
        vehicleId: 'test-vehicle-id',
      };

      (db.write as jest.Mock).mockResolvedValue(fakeData);

      const { result } = renderHook(() => useCreateActivity());
      const [f] = result.current;

      const callResult = await waitFor(async () => {
        return await f(fakeData);
      });

      expect(callResult.success).toBeTrue();
      expect(callResult.data).toBe(fakeData);
    });
  });
});

describe('useUpdateActivity()', () => {
  it('returns correct initial result', () => {
    const { result } = renderHook(() => useUpdateActivity());
    const [f, { error, isLoading }] = result.current;

    expect(f).toBeFunction();
    expect(isLoading).toBeFalse();
    expect(error).toBeNull();
  });

  describe('update function', () => {
    it('returns data on success', async () => {
      const fakeData = {
        categoryId: 'test-category-id',
        comment: 'Lorem ipsum dolor sit amet',
        cost: 77700,
        date: new Date().valueOf(),
        id: 'test-activity-id',
        location: 'New York',
        subcategoryId: 'test-subcategory-id',
        vehicleId: 'test-vehicle-id',
      };

      (db.write as jest.Mock).mockResolvedValue(fakeData);

      const { result } = renderHook(() => useUpdateActivity());
      const [f] = result.current;

      const callResult = await waitFor(async () => {
        return await f(fakeData);
      });

      expect(callResult.success).toBeTrue();
      expect(callResult.data).toBe(fakeData);
    });
  });
});

describe('useDeleteActivity()', () => {
  it('returns correct initial result', () => {
    const { result } = renderHook(() => useDeleteActivity());
    const [f, { error, isLoading }] = result.current;

    expect(f).toBeFunction();
    expect(isLoading).toBeFalse();
    expect(error).toBeNull();
  });

  describe('delete function', () => {
    it('returns success after delete', async () => {
      const { result } = renderHook(() => useDeleteActivity());
      const [f] = result.current;

      const callResult = await waitFor(async () => {
        return await f('xyz');
      });

      expect(callResult.success).toBeTrue();
      expect(callResult.data).toBeNull();
    });
  });
});

describe('useActivityById()', () => {
  it('returns null for null parameter', () => {
    (db.get as jest.Mock).mockImplementation(() => ({
      findAndObserve: jest.fn(
        () =>
          new Observable((subscriber) => {
            subscriber.next('this must not be returned');
            subscriber.complete();
          }),
      ),
    }));

    const { result } = renderHook(() => useActivityById(null));

    const [data] = result.current;

    expect(data).toBeNull();
  });
  it("returns error if record wasn't found", () => {
    (db.get as jest.Mock).mockImplementation(() => ({
      findAndObserve: jest.fn(() => {
        return new Observable((subscriber) => {
          subscriber.error('Not found');
        });
      }),
    }));

    const { result } = renderHook(() => useActivityById('some-id'));

    const [data, { error }] = result.current;

    expect(data).toBeNull();
    expect(error).toBeTruthy();
  });
  it('returns data on success', () => {
    const fakeData = { id: 'some-id' };

    (db.get as jest.Mock).mockImplementation(() => ({
      findAndObserve: jest.fn(
        () =>
          new Observable((subscriber) => {
            subscriber.next(fakeData);
            subscriber.complete();
          }),
      ),
    }));

    const { result } = renderHook(() => useActivityById('some-id'));

    const [data, { error }] = result.current;

    expect(data).toBe(fakeData);
    expect(error).toBeNull();
  });
});
