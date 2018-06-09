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
 * Created: December 16, 2016
 *
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
    const studyData = get(state, 'studyManager.study.data');
    const isFavourite = get(studyData, 'favourite', false);

    return {
      studyTitle: get(studyData, 'title', ''),
      isEditable: get(studyData, `permissions[${studyPermissions.editStudy}]`, false),
      breadcrumbList: [
        {
          label: 'My studies',
          link: paths.studies(),
        },
      ],
      backurl: paths.studies(),
      isFavourite,
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
      setFavourite: () => dispatchProps.favourite(
          ownProps.studyId,
          (!stateProps.isFavourite).toString()
        )
        .then(() => dispatchProps.loadStudy({ id: ownProps.studyId }))
        .catch(() => {}),
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
