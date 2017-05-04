import * as React from 'react';
import { PlainRoute } from 'react-router';

function rootRoute(path: string): PlainRoute {
  return {
    path,
    component: ({ children }) => children,
    indexRoute: {
      onEnter: (nextState, replace) => {
        replace(path + '/login');
      }
    },
    childRoutes: [
      {
        path: 'login',
        component: require('./components/Login').default,
      },
      {
        path: 'complete',
        component: require('./components/LoginComplete').default,
      },
    ],
  };
}

export default rootRoute;
