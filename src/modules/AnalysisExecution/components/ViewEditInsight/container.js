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
 * Created: May 05, 2017
 *
 */

import { Component, PropTypes } from 'react';
import { get, ContainerBuilder } from 'services/Utils';
import actions from 'actions';
import presenter from './presenter';
import { setActiveModuleAccordingToStudyKind } from 'modules/StudyManager/utils';

const moduleActions = actions.analysisExecution;

class ViewEditInsight extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.submissionId !== this.props.submissionId) {
      this.props.unloadComments();
      this.props.unloadFile();
      this.props.loadInsight({ submissionId: nextProps.submissionId });
    }
  }

  render() {
    return presenter(this.props);
  }
}

ViewEditInsight.propTypes = {
  loadInsight: PropTypes.func.isRequired,
  submissionId: PropTypes.number.isRequired,
};

export default class ViewEditInsightBuilder extends ContainerBuilder {

  getComponent() {
    return ViewEditInsight;
  }

  mapStateToProps(state, ownProps) {
    const moduleState = get(state, 'analysisExecution');
    const insightData = get(moduleState, 'insight.data.result');
    const insightTitle = get(moduleState, 'insight.data.result.name', 'Insight');
    const analysisTitle = get(insightData, 'analysis.title', 'Analysis');
    const studyTitle = get(insightData, 'analysis.study.title', 'Study');
    const isEditable = get(insightData, 'permissions.EDIT_INSIGHT', false);
    const pageTitle = [
      insightTitle,
      analysisTitle,
      studyTitle,
      'Arachne',
    ];
  
    return {
      isLoading: get(moduleState, 'insight.isLoading', false) || get(state, 'studyManager.studyInvitations.isLoading'),
      submissionId: parseInt(ownProps.routeParams.submissionId, 10),
      insightTitle: get(insightData, 'name', ''),
      pageTitle: pageTitle.join(' | '),
      studyId: get(insightData, 'analysis.study.id', -1),
      isEditable,
    };
  }

  getMapDispatchToProps() {
    return {
      loadInsight: moduleActions.insight.find,
      unloadComments: moduleActions.insightComments.unload,
      unloadFile: moduleActions.insightFile.unload,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      onBannerActed: () => dispatchProps.loadInsight({ submissionId: stateProps.submissionId }),
    };
  }

  getFetchers({ params, dispatch }) {
    const componentActions = this.getMapDispatchToProps();
    const submissionId = params.submissionId;
    return {
      loadInsight: dispatch(componentActions.loadInsight({ submissionId }))
        .then(result => {
          const kind = get(result, 'result.analysis.study.kind', '');
          setActiveModuleAccordingToStudyKind({ kind, dispatch });
        }),
      unloadComments: moduleActions.insightComments.unload,
      unloadFile: moduleActions.insightFile.unload,
    };
  }

}
