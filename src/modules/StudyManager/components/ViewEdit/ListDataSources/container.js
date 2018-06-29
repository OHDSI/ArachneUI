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
import { modal } from 'modules/StudyManager/const';
import { ModalUtils } from 'arachne-ui-components';
import actions from 'actions/index';
import ListDataSources from './presenter';
import SelectorsBuilder from './selectors';

const selectors = (new SelectorsBuilder()).build();

export default class ListDataSourcesBuilder {
  getComponent() {
    return ListDataSources;
  }

  mapStateToProps(state) {
    const studyData = get(state, 'studyManager.study.data');

    return {
      studyId: get(studyData, 'id'),
      dataSourceList: selectors.getDataSourceList(state),
      hasAttachPermissions: selectors.hasAttachPermissions(state),
      hasDeletePermissions: selectors.hasDeletePermissions(state),
      hasEditStudyPermissions: selectors.hasEditStudyPermissions(state),
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      openAddModal: ModalUtils.actions.toggle.bind(null, modal.addDataSource, true),
      loadStudy: actions.studyManager.study.find,
      addDataSource: actions.studyManager.study.dataSource.create,
      removeDataSource: actions.studyManager.study.dataSource.delete,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      addDataSource(dataSourceId) {
        dispatchProps
          .addDataSource({ studyId: stateProps.studyId, dataSourceId })
          .then(() => dispatchProps.loadStudy({ id: stateProps.studyId }));
      },
      removeDataSource(dataSourceId, title) {
        Utils.confirmDelete({
          message: `Are you sure you want to delete this data source '${title}' from study?`,
        })
          .then(() => {
            dispatchProps
              .removeDataSource({ studyId: stateProps.studyId, dataSourceId })
              .then(() => dispatchProps.loadStudy({ id: stateProps.studyId }));
          });
      },
      editDataSource(dataSourceId) {
        dispatchProps
          .openAddModal({ studyId: stateProps.studyId, dataSourceId });
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
