import * as React from 'react';
import { PlainRoute } from 'react-router';
import Auth from 'services/Auth';

function rootRoute(path: string): PlainRoute {
  return {
    path,
    component: ({ children }) => children,
    indexRoute: {
      onEnter: (nextState, replace) => {
        replace(`/${path}/licenses`);
      }
    },
    childRoutes: [
      {
        path: 'licenses',
        component: require('./components/Licenses').default,
        onEnter: Auth.requireOnPathEnter,
      },
    ],
  };
}

export default rootRoute;
