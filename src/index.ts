import dva from 'dva';
import createLoading from 'dva-loading';
import { createBrowserHistory } from 'history';

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
app.model(require('./models/app').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
