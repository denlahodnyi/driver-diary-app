import { MMKV, useMMKVString } from 'react-native-mmkv';

type StringKeys = 'selectedVehicleId';
type NumberKeys = never;
type BooleanKeys = never;
type BufferKeys = never;
type Keys = StringKeys | NumberKeys | BooleanKeys | BufferKeys;

type SetterValue<T> = T extends NumberKeys
  ? number
  : T extends BooleanKeys
  ? boolean
  : T extends BufferKeys
  ? Uint8Array
  : string;

class Storage extends MMKV {
  set<T extends Keys>(key: T, value: SetterValue<T>): void {
    return super.set(key, value);
  }

  getString(key: StringKeys) {
    return super.getString(key);
  }

  getNumber(key: NumberKeys) {
    return super.getNumber(key);
  }

  getBoolean(key: BooleanKeys) {
    return super.getBoolean(key);
  }

  getBuffer(key: BufferKeys) {
    return super.getBuffer(key);
  }

  addOnValueChangedListener(onValueChanged: (key: Keys) => void) {
    return super.addOnValueChangedListener(
      onValueChanged as (k: string) => void,
    );
  }
}

export const storage = new Storage();

export function useStorageString(key: Keys, instance?: Storage) {
  return useMMKVString(key, instance);
}
