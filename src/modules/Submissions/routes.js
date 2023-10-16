import React from 'react';
import { Route } from 'react-router';
import ListDataSources from './components/List/index';
// import SubmissionResultFile from './components/ResultFile';
function Routes() {
  return [
    <Route path="list" component={ListDataSources} />,
    //   <Route
    //     path="submissions/:submissionId/results/:fileId"
    //     component={SubmissionResultFile}
    //     type="result"
    //     from="SUBMISSION"
    //   />,
    // <Route
    //   path="submissions/:submissionId/results"
    //   component={SubmissionResultFile}
    // />
  ];
}

export default Routes;