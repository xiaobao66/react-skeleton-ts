import { AnyAction, Reducer } from 'redux';

export interface StateType {
  [key: string]: any;
}

export type ReducerType = (
  state: StateType,
  args: { [key: string]: any },
) => any;

interface ArgsType {
  namespace: string;
  state: StateType;
  reducers?: {
    [key: string]: ReducerType;
  };
}

export default ({
  namespace,
  state: initialState,
  reducers,
}: ArgsType): Reducer => (
  state: StateType = initialState,
  action: AnyAction,
) => {
  const [prefix, type] = action.type.split('/');

  if (namespace === prefix && reducers[type]) {
    return reducers[type](state, { payload: action.payload });
  }

  return state;
};
