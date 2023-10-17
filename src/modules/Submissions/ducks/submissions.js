import Duck from 'services/Duck';
import { apiPaths } from 'modules/Submissions/const';

const actionCoreName = 'SUBMISSIONS_PANEL_RESULT_NODE';

const resultSubmission = new Duck({
    name: actionCoreName,
    urlBuilder: apiPaths.submissionResults,
});

const actions = resultSubmission.actions;
const reducer = resultSubmission.reducer;

export default ({
    actions,
    reducer,
});