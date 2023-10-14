import { createSelector } from 'reselect';
import { get, sortOptions } from 'services/Utils';
import { extensionsForEntryPoints } from 'modules/Submissions/const';

const getRawEntryPointsOptionList = state => get(state, 'submissions.entryPointsOptionList.options') || [];
const getRawFileField = state => get(state, 'form.createSubmission.values.file') || [];
const getRawDataSourcesOptionList = state => get(state, 'submissions.dataSourcesOptionList.queryResult.result') || [];
const getRawEnvironmentList = state => get(state, 'submissions.environmentList.queryResult') || [];
const getRawAnalysisTypesOptionList = state => get(state, 'submissions.analysisTypesOptionList.queryResult') || [];

const getEnvironmentList = createSelector(
  [getRawEnvironmentList],
  items => {
    const options = items.map(({ label, id }) => ({
      label: label,
      value: id.toString(),
    }));
    return sortOptions(options);
  }
);

const getDataSourcesOptionList = createSelector(
  [getRawDataSourcesOptionList],
  rawDataSourcesOptionList => {
    const dataSourceOptions = rawDataSourcesOptionList.map(({ name, id }) => ({
      label: name,
      value: id.toString(),
    }));
    return sortOptions(dataSourceOptions);
  }
);

const getAnalysisTypesOptionList = createSelector(
  [getRawAnalysisTypesOptionList],
  rawAnalysisTypesOptionList => {
    const sourceOptions = rawAnalysisTypesOptionList.map(({ name, id }) => ({
      label: name,
      value: id.toString(),
    }));
    return sortOptions(sourceOptions);
  }
);

const getEntryPointsOptionList = createSelector(
  [getRawEntryPointsOptionList, getRawFileField],
  (rawEntryPointsOptionList, fileField) => {
    if (fileField.length === 0) {
      return [];
    }
    const entryPoints = rawEntryPointsOptionList
      .filter(item => extensionsForEntryPoints.some(ext => item.endsWith(ext)))
      .map((item) => ({ label: item, value: item }));
    return sortOptions(entryPoints);
  }
);

export default {
  getEntryPointsOptionList,
  getEnvironmentList,
  getDataSourcesOptionList,
  getAnalysisTypesOptionList,
};
