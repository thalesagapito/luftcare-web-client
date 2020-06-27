export type Nullable<T> = T | undefined;
export type NullablePromise<T> = Promise<T | undefined>;
export type Keyed<T> = T & { key: string };
export type WithIsValid<T> = T & { isValid: boolean };
export type OmitFrom<T, K extends keyof T> = Omit<T, K>;
export type Override<T, U> = Omit<T, keyof U> & U;
export type UpdateFieldWithValueFunction<T> = <K extends keyof T>(field: K, value: T[K]) => void;
