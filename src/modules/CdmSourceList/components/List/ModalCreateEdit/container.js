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
 * Created: December 20, 2016
 *
 */

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm, reset as resetForm } from 'redux-form';
import { get } from 'services/Utils';

import actions from 'actions';
import { ModalUtils } from 'arachne-ui-components';
import { modal, form, kerberosAuthType } from 'modules/CdmSourceList/const';
import presenter from './presenter';
import selectors from './selectors';
import { nodeFunctionalModes } from 'modules/Auth/const';

class ModalCreateEdit extends Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.isOpened === true && nextProps.isOpened === false) {
      this.props.resetForm();
    }
    if (nextProps.dataSourceId !== this.props.dataSourceId) {
      if (nextProps.dataSourceId) {
        // If was selected editing of some Data Source - load its data
        this.props.loadDataSource({id: nextProps.dataSourceId});
      } else {
        // Otherwise - clear form
        this.props.resetDataSource();
      }
    }
  }

  render() {
    return presenter(this.props);
  }
}

ModalCreateEdit.propTypes = {
  dataSourceId: PropTypes.number,
  loadDataSource: PropTypes.func.isRequired,
  resetDataSource: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const dataSourceData = get(state, 'cdmSourceList.dataSource.queryResult.result', {}, 'Object');
  const isOpened = get(state, 'modal.createDataSource.isOpened', false);
  const dbmsType = get(state, 'form.createDataSource.values.dbmsType');
  const runningMode = get(state, 'auth.nodeMode.data.mode');

  dataSourceData.krbAuthMethod = dataSourceData.krbAuthMethod || kerberosAuthType.PASSWORD;

  return {
    dbmsTypeList: selectors.getDbmsTypeList(state),
    cdmVersionList: selectors.getCDMVersionList(state),
    currentListQuery: state.routing.locationBeforeTransitions.query,
    dataSourceId: get(state.modal[form.createDataSource], 'data.id'),
    isLoading: state.cdmSourceList.dataSource.isLoading,
    hasKeytab: dataSourceData.hasKeytab,
    authMethod: get(state, 'form.createDataSource.values.krbAuthMethod'),
    initialValues: {
      ...dataSourceData,
      dbmsType: get(dataSourceData, 'dbmsType'),
    },
    isStandalone: runningMode === nodeFunctionalModes.Standalone,
    isOpened,
    dbmsType,
  };
}

const mapDispatchToProps = {
  loadDataSource: actions.cdmSourceList.dataSource.query,
  resetDataSource: () => actions.cdmSourceList.dataSource.reset,
  createDataSource: actions.cdmSourceList.dataSource.create,
  updateDataSource: actions.cdmSourceList.dataSource.update,
  resetForm: () => resetForm(form.createDataSource),
  closeModal: () => ModalUtils.actions.toggle(modal.createDataSource, false),
  loadDataSourceList: actions.cdmSourceList.dataSourceList.query,
  deleteDataSourceKeytab: actions.cdmSourceList.dataSourceKeytab.delete,
  refreshBuildInfo: actions.portal.buildInfo.find,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    doSubmit(data) {
      data.useKerberos = !!data.useKerberos;
      const oldName = stateProps.dataSourceName;
      const submitPromise = stateProps.dataSourceId
        ? dispatchProps.updateDataSource({id: stateProps.dataSourceId}, data)
          : dispatchProps.createDataSource({}, data);

      submitPromise
        .then(() => dispatchProps.resetForm())
        .then(() => dispatchProps.closeModal())
        .then(() => dispatchProps.refreshBuildInfo())
        .then(() => dispatchProps.loadDataSourceList({}, {query: stateProps.currentListQuery}))
        .catch(() => {});

      // We have to return a submission promise back to redux-form
      // to allow it update the state
      return submitPromise;
    },
    deleteKeytab() {
      const id = stateProps.dataSourceId;
      dispatchProps.deleteDataSourceKeytab({id}).then(() => dispatchProps.loadDataSource({id}));
    },
  });
}

let ReduxModalCreateEdit = reduxForm({
  form: form.createDataSource,
  enableReinitialize: true,
})(ModalCreateEdit);

ReduxModalCreateEdit = ModalUtils.connect({
  name: modal.createDataSource,
})(ReduxModalCreateEdit);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxModalCreateEdit);
