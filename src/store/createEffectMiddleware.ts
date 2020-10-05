import { Middleware } from 'redux';
import { ModelType, EffectType } from './createModel';

interface DispatchArgsType {
  type: string;
  [key: string]: any;
}

type SelectFunc = (state: any) => any;

export default (models: { [key: string]: ModelType }): Middleware => {
  function getEffect(type: string) {
    const [namespace] = type.split('/');
    const model = models[namespace];

    if (model) {
      if (model.effects && model.effects[type]) {
        return [model.effects[type], namespace];
      }
    }

    return [];
  }

  return ({ dispatch, getState }) => next => action => {
    const { type, payload } = action;
    const [effect, namespace] = getEffect(type);

    if (effect) {
      return (<EffectType>effect)(
        { payload },
        {
          dispatch: ({ type: t, ...params }: DispatchArgsType) => {
            if (t.split('/').length > 1) {
              return dispatch({
                type: t,
                ...params,
              });
            }

            return dispatch({
              type: `${namespace}/${t}`,
              ...params,
            });
          },
          select: (f: SelectFunc) => f(getState()),
        },
      );
    }

    return next(action);
  };
};
