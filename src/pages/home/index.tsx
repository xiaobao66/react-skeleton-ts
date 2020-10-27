import React, { useState } from 'react';
import { Button } from 'antd';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RouteComponentProps } from 'react-router-dom';
import { AppState } from 'models/app';
import styles from './index.less?local';

interface Props extends RouteComponentProps {
  dispatch: Dispatch;
  app: AppState;
}

function Home({ history, dispatch }: Props) {
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setLoading(true);

    try {
      await dispatch({
        type: 'app/login',
        payload: {
          user: { name: 'xiaobaowei' },
        },
      });

      history.push({
        pathname: '/dashboard',
      });
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>React Skeleton</h1>
          <div>
            <Button type="primary" loading={loading} onClick={onLogin}>
              登录
            </Button>
          </div>
        </div>
        <div className={styles.logo}>
          <img src="/assets/images/react.svg" alt="" />
        </div>
      </div>
    </div>
  );
}

export default connect(({ app }: { app: AppState }) => ({ app }))(Home);
