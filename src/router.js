import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, routerRedux } from 'dva/router';
import dynamic from 'dva/dynamic';
import 'themes/index.less';
import 'assets/styles/index.scss';

const { ConnectedRouter } = routerRedux;

const Routers = ({ history, app }) => {
  const renderRoutes = (routes, parentPath = '') => {
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

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
};

export default Routers;
