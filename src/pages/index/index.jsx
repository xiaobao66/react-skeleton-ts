import React from 'react';
import PropTypes from 'prop-types';
import logoImg from 'assets/images/index/react.svg';
import styles from './index.scss?local';

function Index() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>React Skeleton</h1>
        </div>
        <div className={styles.logo}>
          <img src={logoImg} alt="" />
        </div>
      </div>
    </div>
  );
}

export default Index;
