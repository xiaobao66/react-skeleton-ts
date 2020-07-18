import dva from 'dva';
import createLoading from 'dva-loading';
import { createBrowserHistory } from 'history';
import appModel from 'models/app';
import router from './router';

// 拦截未处理的rejection
window.addEventListener('unhandledrejection', event => {
  console.warn('未处理的错误', event.reason);
});

// 1. Initialize
const app = dva({
  history: createBrowserHistory(),
  onError(error) {
    console.error(error.message);
  },
});

// 2. Plugin
app.use(createLoading());

// 3. Modal
app.model(appModel);

// 4. Router
app.router(router);

// 5. Start
app.start('#root');
