import qs from 'qs';
import modelExtend from 'dva-model-extend';
import { model } from 'models/common';
import { SubscriptionAPI } from 'dva';
import { Location } from 'history';

export default modelExtend(model, {
  namespace: 'app',
  state: {
    locationPathname: '',
    locationQuery: {},
  },
  subscriptions: {
    setupHistory({ dispatch, history }: SubscriptionAPI) {
      return history.listen((location: Location) => {
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
