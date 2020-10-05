import { StateType, ReducerType } from './createReducer';

export type EffectType = (
  args: { [key: string]: any },
  funcs: { [key: string]: any },
) => any;

export interface ModelType {
  namespace: string;
  state: StateType;
  reducers?: {
    [key: string]: ReducerType;
  };
  effects?: {
    [key: string]: EffectType;
  };
}

function prefix(obj: { [key: string]: any }, namespace: string) {
  return Object.keys(obj).reduce((memo, key) => {
    return {
      ...memo,
      [`${namespace}/${key}`]: obj[key],
    };
  }, {});
}

export default function(model: ModelType): any {
  const { namespace, reducers, effects } = model;
  const extra: Pick<ModelType, 'reducers' | 'effects'> = {};

  if (reducers) {
    extra.reducers = prefix(reducers, namespace);
  }

  if (effects) {
    extra.effects = prefix(effects, namespace);
  }

  return {
    ...model,
    ...extra,
  };
}
