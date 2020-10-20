import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { connect } from 'react-redux';
import styles from './index.less?local';

function Home({ history, dispatch }) {
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

Home.propTypes = {
  history: PropTypes.object,
  dispatch: PropTypes.func,
};

export default connect(({ app }) => ({ app }))(Home);
