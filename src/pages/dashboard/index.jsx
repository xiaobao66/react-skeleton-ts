import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Dashboard() {
  const user = useSelector(state => state.app.user);

  return (
    <div>{!user ? <Link to="/">请登录</Link> : <p>hello {user.name}</p>}</div>
  );
}

export default Dashboard;
