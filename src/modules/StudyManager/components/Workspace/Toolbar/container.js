/*
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
 * Authors: Anton Gackovka
 * Created: June 4, 2018
 */

// @ts-check
import { Utils } from 'services/Utils';
import get from 'lodash/get';
import { modal, paths, studyPermissions } from 'modules/StudyManager/const';
import { ModalUtils } from 'arachne-ui-components';
import actions from 'actions';
import StudyToolbar from './presenter';

export default class StudyToolbarBuilder {
  getComponent() {
    return StudyToolbar;
  }

  mapStateToProps(state) {
    const studyData = get(state, 'studyManager.study.data.result');

    return {
      studyTitle: get(studyData, 'title', ''),
      userId: 'ADIANgAyADEANAA0',
      title: 'AGackovka',
    };
  }

  getMapDispatchToProps() {
    return {
      openEditTitleModal: ModalUtils.actions.toggle.bind(null, modal.editStudyTitle, true),
      loadStudy: actions.studyManager.study.find,
      favourite: actions.studyManager.studyList.setFavourite,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      reload: () => {
        dispatchProps.loadStudy(1);
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
