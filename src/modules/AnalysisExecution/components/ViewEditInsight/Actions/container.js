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
 * Created: June 27, 2017
 *
 */

import { connect } from 'react-redux';
import actions from 'actions/index';
import { push } from 'react-router-redux';
import { paths } from 'modules/AnalysisExecution/const';
import { Utils, get } from 'services/Utils';
import InsightActions from './presenter';

function mapStateToProps(state) {
  const insight = get(state, 'analysisExecution.insight', null);

  return {
    submissionId: get(insight, 'data.result.submission.id'),
    analysisId: get(insight, 'data.result.analysis.id'),
    name: get(insight, 'data.result.name'),
  };
}

const mapDispatchToProps = {
  goToAnalysisPage: id => push.call(null, paths.analyses(id)),
  remove: actions.analysisExecution.insight.delete,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    remove: () => {
      Utils.confirmDelete({
        message: `Are you sure want to delete insight '${stateProps.name}'?`,
      })
        .then(() => {
          dispatchProps.remove({ submissionId: stateProps.submissionId })
            .then(dispatchProps.goToAnalysisPage(stateProps.analysisId));
        });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(InsightActions);
