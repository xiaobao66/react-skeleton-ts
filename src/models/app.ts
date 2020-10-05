import modelExtend from 'store/modelExtend';
import { model } from 'models/common';

export default modelExtend(model, {
  namespace: 'app',
  state: {
    user: null,
  },
  effects: {
    async login({ payload }, { dispatch }) {
      await new Promise(resolve => setTimeout(() => resolve(), 1000));

      dispatch({
        type: 'updateState',
        payload,
      });
    },
  },
});
