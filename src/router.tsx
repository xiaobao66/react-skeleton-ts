import React from 'react';
import { Switch, Route, routerRedux } from 'dva/router';
import { Router, RouterAPI } from 'dva';
import dynamic from 'dva/dynamic';
import 'themes/default.less';
import 'assets/styles/index.scss';

const { ConnectedRouter } = routerRedux;

const Routers: Router = ({ history, app }: RouterAPI): JSX.Element => {
  const renderRoutes = (routes: any[], parentPath = ''): any[] => {
    return routes.reduce(
      (accumulator, { path, childRoutes, component, models }) => {
        const compiledPath = `${parentPath}${path}`;
        const childRouteComponents = childRoutes
          ? renderRoutes(childRoutes, compiledPath)
          : [];

        if (!component) {
          return accumulator.concat(childRouteComponents);
        }

        return accumulator.concat(
          <Route
            key={compiledPath}
            exact
            path={compiledPath}
            component={dynamic({
              app,
              component,
              models,
            })}
          />,
          childRouteComponents,
        );
      },
      [],
    );
  };

  const error = () => <div>404</div>;

  const portalRoutes = [
    {
      path: '/',
      component: () => import('pages/index'),
    },
    {
      path: '/list',
      component: () => import('pages/list'),
    },
  ];

  return (
    <ConnectedRouter history={history}>
      <Switch>
        {renderRoutes(portalRoutes)}
        <Route component={error} />
      </Switch>
    </ConnectedRouter>
  );
};

export default Routers;
