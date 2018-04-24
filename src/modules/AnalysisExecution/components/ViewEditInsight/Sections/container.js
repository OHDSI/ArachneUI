/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
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
 * Created: May 05, 2017
 *
 */

import { connect } from 'react-redux';
import get from 'lodash/get';
import actions from 'actions/index';
import Sections from './presenter';
import selectors from './selectors';

function mapStateToProps(state) {
  const path =
      `${get(state, 'routing.locationBeforeTransitions.pathname', '')}${
      get(state, 'routing.locationBeforeTransitions.search', '')}`;

  const codeFiles = selectors.getCodeList(state);
  const codePageCount = selectors.getCodePageCount(state);
  const codePageCurrent = selectors.getCurrentCodePage(state);
  const resultFiles = selectors.getResultFileList(state);
  const resultPageCount = selectors.getResultPageCount(state);
  const resultPageCurrent = selectors.getCurrentResultPage(state);

  return {
    path,
    codeFiles,
    resultFiles,
    codePageCount,
    codePageCurrent,
    resultPageCount,
    resultPageCurrent,
  };
}

const mapDispatchToProps = {
  loadComments: actions.analysisExecution.insightComments.query,
  unloadComments: actions.analysisExecution.insightComments.unload,
  unloadFile: actions.analysisExecution.insightFile.unload,
  selectFile: actions.analysisExecution.insightFile.select,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    toggleComments: (file) => {
      if (file.isSelected) {
        dispatchProps.unloadComments();
        dispatchProps.unloadFile();
      } else {
        dispatchProps
          .loadComments({ commentTopicId: file.commentTopicId })
          .then(() => dispatchProps.selectFile(file));
      }
    },
  });
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Sections);
