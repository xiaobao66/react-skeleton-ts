function prefix(obj, namespace) {
  return Object.keys(obj).reduce((memo, key) => {
    return {
      ...memo,
      [`${namespace}/${key}`]: obj[key],
    };
  }, {});
}

export default function(model) {
  const { namespace, reducers, effects } = model;
  const extra = {};

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
