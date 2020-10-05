export default function(...models) {
  const base = { state: {}, reducers: {}, effects: {} };

  const model = models.reduce((acc, extend) => {
    acc.namespace = extend.namespace;

    if (typeof extend.state === 'object') {
      Object.assign(acc.state, extend.state);
    }
    if (typeof extend.reducers === 'object') {
      Object.assign(acc.reducers, extend.reducers);
    }
    if (typeof extend.effects === 'object') {
      Object.assign(acc.effects, extend.effects);
    }

    return acc;
  }, base);

  return model;
}
