import modelExtend from 'store/modelExtend';
import { model } from 'models/common';
import request from 'utils/request';

export default modelExtend(model, {
  namespace: 'app',
  state: {
    user: null,
  },
  effects: {
    async login({ payload }, { dispatch }) {
      const {
        data: { user },
      } = await request({
        url: '/api/user/login',
        method: 'post',
        data: payload,
      });

      dispatch({
        type: 'updateState',
        payload: {
          user,
        },
      });
    },
  },
});
