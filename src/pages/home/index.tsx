import React, { useState } from 'react';
import { Button, Input, Form, message } from 'antd';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RouteComponentProps } from 'react-router-dom';
import { AppState } from 'models/app';
import styles from './index.less?local';

const FormItem = Form.Item;

interface IProps extends RouteComponentProps {
  dispatch: Dispatch;
  app: AppState;
}

function Home({ history, dispatch }: IProps) {
  const [loading, setLoading] = useState(false);
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = async () => {
    setLoading(true);

    try {
      await dispatch({
        type: 'app/login',
        payload: {
          username,
          password,
        },
      });

      history.push({
        pathname: '/dashboard',
      });
    } catch (e) {
      setLoading(false);
      message.error({ content: e.message });
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>React Skeleton</h1>
          <div>
            <div>
              <FormItem>
                <Input
                  placeholder="请输入用户名"
                  value={username}
                  onChange={e => setUserName(e.target.value)}
                />
              </FormItem>
              <FormItem>
                <Input
                  type="password"
                  placeholder="请输入密码"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </FormItem>
            </div>
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
