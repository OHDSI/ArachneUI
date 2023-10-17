import React from 'react';
import { Route } from 'react-router';
import ListDataSources from './components/List/index';
import Test from './components/List/FileExplorer/FileExplorer';

function Routes() {
  return [
    <Route path="list" component={ListDataSources} />,
    <Route
      path=":submissionId/results"
      component={Test}
    />
  ];
}

export default Routes;