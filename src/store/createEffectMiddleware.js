export default models => {
  function getEffect(type) {
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
      return effect(
        { payload },
        {
          dispatch: ({ type: t, ...params }) => {
            if (t.split('/').length > 1) {
              return dispatch({
                t,
                ...params,
              });
            }

            return dispatch({
              type: `${namespace}/${t}`,
              ...params,
            });
          },
          select: f => f(getState()),
        },
      );
    }

    return next(action);
  };
};
