import {
  createStore,
  combineReducers,
  applyMiddleware,
  Store,
  Reducer,
} from 'redux';
import thunk from 'redux-thunk';
import app from 'models/app';
import createModel, { ModelType } from './createModel';
import createReducer, { StateType } from './createReducer';
import createEffectMiddleware from './createEffectMiddleware';

export interface StoreType extends Store {
  injectModel: (name: string, m: ModelType) => void;
}
interface ReducerMap {
  [key: string]: Reducer;
}
interface ModelMap {
  [key: string]: ModelType;
}

const initialModels = [app];

const _models: ModelMap = {};
const _staticReducers: ReducerMap = {};
const _asyncReducers: ReducerMap = {};

function combine() {
  return combineReducers({
    ..._staticReducers,
    ..._asyncReducers,
  });
}

export default function(initialState: StateType): StoreType {
  initialModels.forEach(m => {
    _models[m.namespace] = createModel(m);
    _staticReducers[m.namespace] = createReducer(m);
  }, {});

  const store = createStore(
    combine(),
    initialState,
    applyMiddleware(createEffectMiddleware(_models), thunk),
  );

  return {
    ...store,
    injectModel: (name, m) => {
      const model = createModel(m);

      if (_models[name]) {
        return;
      }

      _models[name] = model;
      _asyncReducers[name] = createReducer(m);

      store.replaceReducer(combine());
    },
  };
}
