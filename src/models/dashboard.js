import modelExtend from 'store/modelExtend';
import { model } from 'models/common';

export default modelExtend(model, {
  namespace: 'dashboard',
  state: {
    menus: [],
  },
});
