import submissionList from './submissionList';
import invalidateAnalyses from './invalidate';
import entryPointsOptionList from './entryPointsOptionList';
import analyses from './analyses';
import dataSourcesOptionList from './dataSourcesOptionList';
import analysisTypesOptionList from './analysisTypesOptionList';
import fileDownload from './fileDownload';

const actions = {
    submissionList: submissionList.actions,
    invalidateAnalyses: invalidateAnalyses.actions,
    entryPointsOptionList: entryPointsOptionList.actions,
    analyses: analyses.actions,
    dataSourcesOptionList: dataSourcesOptionList.actions,
    analysisTypesOptionList: analysisTypesOptionList.actions,
    fileDownload: fileDownload.actions,
}

const reducer = {
    submissionList: submissionList.reducer,
    invalidateAnalyses: invalidateAnalyses.reducer,
    entryPointsOptionList: entryPointsOptionList.reducer,
    analyses: analyses.reducer,
    dataSourcesOptionList: dataSourcesOptionList.reducer,
    analysisTypesOptionList: analysisTypesOptionList.reducer,
    fileDownload: fileDownload.reducer,
}

export default {
    actions,
    reducer,
}