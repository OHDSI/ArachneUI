import { createSelector } from 'reselect';
import { get } from 'services/Utils';
import { statusDictionary } from 'modules/Submissions/const';

const getRawSubmissionList = state => get(state, 'submissions.submissionList.queryResult.content') || [];

const getSubmissionList = createSelector(
  [getRawSubmissionList],
  rawSubmissionList => rawSubmissionList.map(item => ({
    ...item,
    status: statusDictionary[item.status],
  }))
);

export default {
  getSubmissionList,
};
