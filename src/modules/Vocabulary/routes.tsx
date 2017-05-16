import * as React from 'react';
import { PlainRoute } from 'react-router';
import Auth from 'services/Auth';

function rootRoute(path: string): PlainRoute {
  return {
    path,
    component: ({ children }) => children,
    indexRoute: {
      onEnter: (nextState, replace) => {
        replace(`/${path}/list`);
      }
    },
    childRoutes: [
      {
        path: 'list',
        component: require('./components/List').default,
        onEnter: Auth.requireOnPathEnter,
      },
      {
        path: 'download-history',
        component: require('./components/DownloadHistory').default,
        onEnter: Auth.requireOnPathEnter,
      },
    ],
  };
}

export default rootRoute;
