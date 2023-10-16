import React from 'react';
import { Route } from 'react-router';
import ListDataSources from './components/List/index';
// import SubmissionResultFile from './components/ResultFile';
import Test from './components/List/Test';

function Routes() {
  return [
    <Route path="list" component={ListDataSources} />,
    //   <Route
    //     path="submissions/:submissionId/results/:fileId"
    //     component={SubmissionResultFile}
    //     type="result"
    //     from="SUBMISSION"
    //   />,
    <Route
      path=":submissionId/results"
      component={Test}
    />
  ];
}

export default Routes;