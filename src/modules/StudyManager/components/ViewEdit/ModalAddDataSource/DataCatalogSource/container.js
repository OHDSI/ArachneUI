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
 * Created: June 23, 2017
 *
 */

// @ts-check
import { Component, PropTypes } from 'react';
import { Utils } from 'services/Utils';
import { reduxForm, reset as resetForm } from 'redux-form';
import get from 'lodash/get';
import actions from 'actions/index';
import { ModalUtils } from 'arachne-ui-components';
import { modal, form } from 'modules/StudyManager/const';
import presenter from './presenter';
import SelectorsBuilder from './selectors';

const selectors = (new SelectorsBuilder()).build();

/** @augments { Component<any, any> } */
export class AddDataCatalogSource extends Component {
  static get propTypes() {
    return {
      isOpened: PropTypes.bool,
      loadDataSourceOptions: PropTypes.func,
    };
  }

  componentWillReceiveProps(props) {
    if (this.props.isOpened === false && props.isOpened === true) {
      this.props.loadDataSourceOptions({
        query: '',
      });
    }
  }

  render() {
    return presenter(this.props);
  }
}

const ReduxAddDataCatalogSource = reduxForm({
  form: form.addCatalogSource,
})(AddDataCatalogSource);

export default class AddDataCatalogSourceBuilder {
  getComponent() {
    return ReduxAddDataCatalogSource;
  }

  mapStateToProps(state) {
    const studyData = get(state, 'studyManager.study.data.result');
    const isSaving = get(state, 'form.addCatalogSource.submitting', false);
    const restItemsCount = get(state, 'studyManager.dataSourceList.data.totalElements', 0);

    return {
      studyId: get(studyData, 'id'),
      dataSourceOptions: selectors.getDataSourceList(state),
      isOpened: get(state, 'modal.addDataSource.isOpened', false),
      studyName: get(studyData, 'title'),
      isSaving,
      restItemsCount,
    };
  }
  
  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      addDataSource: actions.studyManager.study.dataSource.create,
      loadStudy: actions.studyManager.study.find,
      loadDataSource: ({ query, studyId }) =>
        actions.studyManager.dataSourceList.find({ query, studyId }),
      openConfirmDatasource: (datasources, studyName) => ModalUtils.actions.toggle(
        modal.confirmDatasource,
        true,
        { datasources, studyName }
      ),
      closeModal: () => ModalUtils.actions.toggle(modal.addDataSource, false),
      resetForm: resetForm.bind(null, form.addCatalogSource),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return Object.assign({
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      doSubmit({ dataSourceId = [] }) {
        const ids = Object.keys(dataSourceId).filter(key => dataSourceId[key] === true);
        const promises = ids.map(id => dispatchProps.addDataSource({
          studyId: stateProps.studyId,
          dataSourceId: id,
        }));

        let allApproved = false;
        const dataSources = stateProps.dataSourceOptions.filter(datasource =>
          ids.includes(datasource.value)
        );

        const submitPromise = Promise.all(promises)
          .then((responseList) => {
            allApproved = responseList.filter(r => r.status !== 'APPROVED').length === 0;
          })
          .then(() => dispatchProps.resetForm())
          .then(() => dispatchProps.closeModal())
          .then(() => dispatchProps.loadStudy(stateProps.studyId))
          .then(() => {
            if (!allApproved) {
              return dispatchProps.openConfirmDatasource(dataSources, stateProps.studyName);
            }
            return null;
          });

        return submitPromise;
      },
      loadDataSourceOptions: ({ query }) => {
        const studyId = stateProps.studyId;
        if (studyId === undefined) {
          return [];
        }
        return dispatchProps.loadDataSource({ query, studyId });
      },
    });
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
