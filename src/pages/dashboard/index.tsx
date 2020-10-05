import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppState } from 'models/app';

interface AppModel {
  app: AppState;
}

function Dashboard(): JSX.Element {
  const user = useSelector((state: AppModel) => state.app.user);

  return (
    <div>{!user ? <Link to="/">请登录</Link> : <p>hello {user.name}</p>}</div>
  );
}

export default Dashboard;
