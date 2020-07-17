import React from 'react';
import { Button } from 'antd';
import logoImg from 'assets/images/index/react.svg';
import styles from './index.scss?local';

function Index(): JSX.Element {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>React Skeleton</h1>
          <div>
            <Button type="primary">登录</Button>
          </div>
        </div>
        <div className={styles.logo}>
          <img src={logoImg} alt="" />
        </div>
      </div>
    </div>
  );
}

export default Index;
