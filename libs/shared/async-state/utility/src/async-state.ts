import * as R from 'ramda';

type LoadingTypes = 'initial' | 'loading' | 'error' | 'loaded';

export type AsyncStateInitial<T = void> = {
  type: 'initial';
} & T;

export type AsyncStateLoading<T = void> = {
  type: 'loading';
} & T;

export type AsyncStateError<T = void> = {
  type: 'error';
} & T;

export type AsyncStateLoaded<T> = {
  type: 'loaded';
} & T;

/**
 * Union type of all the async states.
 *
 * T = payload type for AsyncStateLoaded<T>
 *
 * To keep things simple, assumes no other states need payload.
 * If they do, create a new union type for the specific need.
 */
export type AsyncState<T> =
  | AsyncStateInitial
  | AsyncStateLoading
  | AsyncStateError
  | AsyncStateLoaded<T>;

const asyncState = <T>(type: LoadingTypes, data?: T): AsyncState<T> => {
  return {
    type,
    ...(data || {}),
  };
};

export const initialAsyncState = R.partial(asyncState, ['initial']) as <T>(
  x?: T
) => AsyncStateInitial<T>;
export const loadingAsyncState = R.partial(asyncState, ['loading']) as <T>(
  x?: T
) => AsyncStateLoading<T>;
export const errorAsyncState = R.partial(asyncState, ['error']) as <T>(
  x?: T
) => AsyncStateError<T>;
export const loadedAsyncState = R.partial(asyncState, ['loaded']) as <T>(
  x: T
) => AsyncStateLoaded<T>;

// Type Guards
export function isLoadedAsyncState<T extends AsyncState<unknown>>(
  thing: T | null
): thing is AsyncStateLoaded<T> {
  return thing?.type === 'loaded';
}

export function isErrorState<T extends AsyncState<unknown>>(
  thing: T
): thing is AsyncStateError<T> {
  return thing.type === 'error';
}

export function isLoadingAsyncState<T extends AsyncState<unknown>>(
  thing: T
): thing is AsyncStateLoading<T> {
  return thing.type === 'loading';
}

export function isInitialAsyncState<T extends AsyncState<unknown>>(
  thing: T
): thing is AsyncStateInitial<T> {
  return thing.type === 'initial';
}
