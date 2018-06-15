/*
 *
 * Copyright 2018 Observational Health Data Sciences and Informatics
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
import {
  goBack,
  push as goToPage,
} from 'react-router-redux';
import { studyPermissions, studyActions } from 'modules/StudyManager/const';
import { paths as paperPaths } from 'modules/InsightsLibrary/const';
import StudyActions from './presenter';

export default class StudyActionsBuilder {
  getComponent() {
    return StudyActions;
  }

  mapStateToProps(state) {
    const moduleState = get(state, 'studyManager');

    const studyData = get(state, 'studyManager.study.data');
    const isEditable = get(studyData, `permissions[${studyPermissions.editStudy}]`, false);
    const analyses = get(studyData, 'analyses', []);
    const docs = get(studyData, 'files', []);
    const participants = get(studyData, 'participants', []);
    const dataSources = get(studyData, 'dataSources', []);
    const publishedPaperId = get(studyData, 'paperId', null);
    const canDelete = isEditable
      && analyses.length === 0
      && docs.length === 0
      && participants.length <= 1
      && dataSources.length === 0;

    const isFilledForPaper = get(studyData, 'title') &&
      get(studyData, 'description') &&
      get(studyData, 'startDate') &&
      get(studyData, 'endDate');

    const canCreatePaper = get(studyData, `status.availableActions`, []).includes(studyActions.createPaper);

    return {
      studyId: get(moduleState, 'study.data.result.id'),
      canDelete,
      publishedPaperId,
      isEditable,
      isFilledForPaper,
      canCreatePaper,
      title: get(studyData, 'title'),
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      loadStudy: actions.studyManager.study.find,
      loadInsights: actions.studyManager.studyInsights.find,
      createPaper: actions.studyManager.study.paper.create,
      goBack,
      remove: actions.studyManager.study.delete,
      goToPaper: (insightId) => goToPage(paperPaths.insights({ insightId })),
      loadSudyInvitations: actions.studyManager.studyInvitations.query,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {

    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      publishPaper: () => {
        dispatchProps.createPaper(
          null,
          {
            studyId: stateProps.studyId,
            accessType: 'PUBLIC',
          }
        ).then(result => dispatchProps.goToPaper(result.id));
      },
      reload: () => {
        dispatchProps.loadStudy({ id: stateProps.studyId });
        dispatchProps.loadInsights({ studyId: stateProps.studyId });
        dispatchProps.loadSudyInvitations({ studyId: stateProps.studyId });
      },
      remove: () => {
        Utils.confirmDelete({
          message: `Are you sure you want to delete study '${stateProps.title}'?`,
        })
          .then(() => {
            dispatchProps.remove(stateProps.studyId)
              .then(() => dispatchProps.goBack())
              .catch(() => {});
          });
      },
      goToPaper: () => dispatchProps.goToPaper(stateProps.publishedPaperId)
    }
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
