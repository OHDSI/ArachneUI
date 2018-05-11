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
 * Created: December 13, 2016
 *
 */

// @ts-check
import { Utils } from 'services/Utils';
import get from 'lodash/get';
import actions from 'actions/index';
import { ModalUtils } from 'arachne-ui-components';
import { modal, studyPermissions } from 'modules/StudyManager/const';
import SelectorsBuilder from './selectors';
import ListAnalyses from './presenter';

const selectors = (new SelectorsBuilder()).build();

export default class ListAnalysesBuilder {
  getComponent() {
    return ListAnalyses;
  }

  mapStateToProps(state) {
    const studyData = get(state, 'studyManager.study.data.result');

    return {
      studyId: get(studyData, 'id'),
      analysisList: selectors.getAnalysisList(state),
      isEditable: get(studyData, `permissions[${studyPermissions.createAnalysis}]`, false),

    };
  }
  
  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      openCreateAnalysisModal: ModalUtils.actions.toggle.bind(null, modal.createAnalysis, true),
      loadStudy: actions.studyManager.study.find,
      moveAnalysis: actions.studyManager.study.analysisMove.create,
      removeAnalysis: actions.studyManager.analyses.delete,
      getTransitions: actions.studyManager.availableTransitions.query,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      moveAnalysis(newList, movedItem, oldIndex, newIndex) {
        dispatchProps
          .moveAnalysis(null, {
            analysisId: movedItem.id,
            newIndex,
          })
          .then(() => dispatchProps.loadStudy(stateProps.studyId));
      },
      removeAnalysis(id, title) {
        Utils.confirmDelete({
          message: `Are you sure you want to delete analysis '${title}'?`,
        })
          .then(() => {
            dispatchProps
              .removeAnalysis(id)
              .then(() => {
                dispatchProps.loadStudy(stateProps.studyId);
                dispatchProps.getTransitions({ studyId: stateProps.studyId });
              });
          });
      },
    };
  }

  build() {
    return Utils.buildConnectedComponent({
      Component: this.getComponent(),
      mapStateToProps: this.mapStateToProps,
      mapDispatchToProps: this.getMapDispatchToProps(),
      mergeProps: this.mergeProps,
    });
  }
}
