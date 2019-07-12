import submissionList from './submissionList';
import invalidateAnalyses from './invalidate';
import entryPointsOptionList from './entryPointsOptionList';
import analyses from './analyses';
import dataSourcesOptionList from './dataSourcesOptionList';

const actions = {
    submissionList: submissionList.actions,
    invalidateAnalyses: invalidateAnalyses.actions,
    entryPointsOptionList: entryPointsOptionList.actions,
    analyses: analyses.actions,
    dataSourcesOptionList: dataSourcesOptionList.actions,
}

const reducer = {
    submissionList: submissionList.reducer,
    invalidateAnalyses: invalidateAnalyses.reducer,
    entryPointsOptionList: entryPointsOptionList.reducer,
    analyses: analyses.reducer,
    dataSourcesOptionList: dataSourcesOptionList.reducer,
}

export default {
    actions,
    reducer,
}