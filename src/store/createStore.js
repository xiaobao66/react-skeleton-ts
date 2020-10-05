import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import app from 'models/app';
import createModel from './createModel';
import createReducer from './createReducer';
import createEffectMiddleware from './createEffectMiddleware';

const initialModels = [app];

const _models = {};
const _staticReducers = {};
const _asyncReducers = {};

function combine() {
  return combineReducers({
    ..._staticReducers,
    ..._asyncReducers,
  });
}

export default function(initialState) {
  initialModels.forEach(m => {
    _models[m.namespace] = createModel(m);
    _staticReducers[m.namespace] = createReducer(m);
  }, {});

  const store = createStore(
    combine(),
    initialState,
    applyMiddleware(createEffectMiddleware(_models), thunk),
  );

  store.injectModel = (name, m) => {
    const model = createModel(m);

    if (_models[model.namespace]) {
      return;
    }

    _models[model.namespace] = model;
    _asyncReducers[model.namespace] = createReducer(m);

    store.replaceReducer(combine());
  };

  return store;
}
