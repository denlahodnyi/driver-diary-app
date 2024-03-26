import { MMKV, useMMKVString } from 'react-native-mmkv';
import { CURRENCY_CODE } from '../constants';
import type { StyleTypes } from '../styles';

export type PrefUserTheme = StyleTypes.AppThemeNames | 'auto';

type StringKeys = 'selectedVehicleId' | 'currencyCode' | 'colorTheme';
type NumberKeys = never;
type BooleanKeys = never;
type BufferKeys = never;
type Keys = StringKeys | NumberKeys | BooleanKeys | BufferKeys;

type UserThemeOrStrValue<T extends string> = T extends 'colorTheme'
  ? PrefUserTheme
  : string;

type SetterValue<T> = T extends 'colorTheme'
  ? PrefUserTheme
  : T extends NumberKeys
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

  getString<T extends StringKeys>(key: T) {
    return super.getString(key) as UserThemeOrStrValue<T> | undefined;
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

export function useStorageString<T extends Keys>(key: T, instance?: Storage) {
  return useMMKVString(key, instance) as [
    value: UserThemeOrStrValue<T> | undefined,
    setValue: (
      value:
        | UserThemeOrStrValue<T>
        | ((
            current: UserThemeOrStrValue<T> | undefined,
          ) => UserThemeOrStrValue<T> | undefined),
    ) => void,
  ];
}

export function setInitialStorageData() {
  if (!storage.getString('currencyCode')) {
    storage.set('currencyCode', CURRENCY_CODE);
  }
  if (!storage.getString('colorTheme')) {
    storage.set('colorTheme', 'light');
  }
}
