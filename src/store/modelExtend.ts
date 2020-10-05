import { ModelType } from './createModel';

export default function(...models: Partial<ModelType>[]): ModelType {
  const base: Partial<ModelType> = { state: {}, reducers: {}, effects: {} };

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

  return <ModelType>model;
}
