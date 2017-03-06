import * as React from 'react';
import { PlainRoute } from 'react-router';

import SearchTermsList from './components/List';

function rootRoute(path: string): PlainRoute {
  return {
    path,
    component: ({ children }) => children,
    indexRoute: {
      onEnter: (nextState, replace) => {
        replace(path + '/terms');
      }
    },
    childRoutes: [
      {
        path: 'terms',
        component: SearchTermsList,
      },
    ],
  };
}

/*

function rootRoute(path: string): PlainRoute {
  return {
    path,
    component: ({ children }) => children,
    getIndexRoute: (partialNextState, callback): any => {
      callback(null, {
        onEnter: (nextState, replace) => {
          replace(path + '/terms');
        }
      });
    },
    getChildRoutes: (partialNextState, callback): any => {
      callback(null, [
        {
          path: 'terms',
          component: SearchTermsList,
        },
      ]);
    },
  };
}


 */

export default rootRoute;
