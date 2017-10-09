/**
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
 * Created: May 17, 2017
 *
 */

import { connect } from 'react-redux';
import get from 'lodash/get';
import actions from 'actions/index';
import { getSelectedOption } from 'services/Utils';
import AnalysisSettings from './presenter';
import selectors from './selectors';

function mapStateToProps(state) {
  const analysisState = get(state, 'analysisExecution.analysis.data.result');

  const typeOptions = selectors.getTypeOptions(state);

  return {
    analysisId: get(analysisState, 'id'),
    isEditable: true, // ???

    typeOptions,
    typeSelected: getSelectedOption(
      typeOptions,
      get(analysisState, 'type.id')
    ),

    canLockCode: get(analysisState, 'permissions.LOCK_ANALYSIS_FILE'),
    isCodeLocked: get(analysisState, 'locked', false),
  };
}

const mapDispatchToProps = {
  load: actions.analysisExecution.analysis.find,
  update: actions.analysisExecution.analysis.update,
  lockCode: actions.analysisExecution.codeLock.create,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    setType: (type) => {
      dispatchProps
        .update(
          { id: stateProps.analysisId },
          { typeId: type }
        )
        .then(() => dispatchProps.load({ id: stateProps.analysisId }));
    },
    codeLock: (locked) => {
      dispatchProps
        .lockCode(
          { analysisId: stateProps.analysisId },
          { locked }
        )
        .then(() => dispatchProps.load({ id: stateProps.analysisId }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(AnalysisSettings);
