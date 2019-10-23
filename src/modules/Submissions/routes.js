import React from 'react';
import { Route } from 'react-router';
import ListDataSources from './components/List/index';

function Routes() {
  return [
    <Route path="list" component={ListDataSources} />
  ];
}

export default Routes;