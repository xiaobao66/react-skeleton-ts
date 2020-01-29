import qs from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';

export default modelExtend(model, {
  namespace: 'app',
  state: {
    locationPathname: '',
    locationQuery: {},
  },
  subscriptions: {
    setupHistory({ dispatch, history }) {
      return history.listen(location => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: qs.parse(location.search.slice(1)),
          },
        });
      });
    },
  },
});
