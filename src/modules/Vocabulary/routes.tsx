import * as React from 'react';
import { PlainRoute } from 'react-router';

function rootRoute(path: string): PlainRoute {
  return {
    path,
    component: ({ children }) => children,
    indexRoute: {
      onEnter: (nextState, replace) => {
        replace(path + '/list');
      }
    },
    childRoutes: [
      {
        path: 'list',
        component: require('./components/List').default,
      },
    ],
  };
}

export default rootRoute;
