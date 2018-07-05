/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: May 11, 2017
 *
 */

import { connect } from 'react-redux';
import { reduxForm, reset as resetForm } from 'redux-form';
import get from 'lodash/get';
import { form } from 'modules/AnalysisExecution/const';
import actions from 'actions/index';
import NewComment from './presenter';

function mapStateToProps(state, ownProps) {
  return {
    insightId: get(state, 'analysisExecution.insight.data.result.id'),
    commentTopicId: get(state, 'analysisExecution.insightComments.queryResult.result.id'),
    selectedFile: get(state, 'analysisExecution.insightFile.data', {}),
    submissionId: ownProps.submissionId,
  };
}

const mapDispatchToProps = {
  createComment: actions.analysisExecution.insightComments.create,
  loadInsightComments: actions.analysisExecution.insightComments.query,
  loadInsight: actions.analysisExecution.insight.find,
  resetForm: resetForm.bind(null, form.newInsightComment),
  unloadFile: actions.analysisExecution.insightFile.unload,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,

    onSubmit: ({ comment }) => dispatchProps
      .createComment(
      {
        commentTopicId: stateProps.commentTopicId,
      },
        { comment }
      )
      .then(dispatchProps.resetForm)
      .then(() => {
        dispatchProps.loadInsightComments(stateProps.selectedFile);
        dispatchProps.loadInsight({
          submissionId: stateProps.submissionId,
        });
      }),
    cancel:() => dispatchProps.unloadFile()
  });
}

const ReduxNewComment = reduxForm({
  form: form.newInsightComment,
})(NewComment);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxNewComment);
