import { createSelector } from 'reselect';
import { get } from 'services/Utils';
import { extensionsForEntryPoints } from 'modules/Submissions/const';

const getRawEntryPointsOptionList = state => get(state, 'submissions.entryPointsOptionList.options') || [];
const getRawFileField = state => get(state, 'form.createSubmission.values.file') || [];
const getRawDataSourcesOptionList = state => get(state, 'submissions.dataSourcesOptionList.queryResult.result') || [];

const getDataSourcesOptionList = createSelector(
  [getRawDataSourcesOptionList],
  rawDataSourcesOptionList => rawDataSourcesOptionList.map(({ name, id }) => ({
    label: name,
    value: id,
  }))
)

const getEntryPointsOptionList = createSelector(
  [getRawEntryPointsOptionList, getRawFileField],
  (rawEntryPointsOptionList, fileField) => fileField.length !== 0
    ? rawEntryPointsOptionList
      .filter(item => extensionsForEntryPoints.some(ext => item.endsWith(ext)))
      .map((item) => ({ label: item, value: item }))
    : []
);

export default {
  getEntryPointsOptionList,
  getDataSourcesOptionList,
};
