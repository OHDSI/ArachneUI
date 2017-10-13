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
 * Created: December 20, 2016
 *
 */

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm, reset as resetForm } from 'redux-form';
import get from 'lodash/get';

import actions from 'actions/index';
import { ModalUtils } from 'arachne-ui-components';
import { modal, form } from 'modules/CdmSourceList/const';
import presenter from './presenter';
import selectors from './selectors';

class ModalCreateEdit extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.dataSourceId !== this.props.dataSourceId) {
      if (nextProps.dataSourceId) {
        // If was selected editing of some Data Source - load its data
        this.props.loadDataSource(nextProps.dataSourceId);
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
  const dataSourceData = state.cdmSourceList.dataSource.data;

  return {
    dbmsTypeList: selectors.getDbmsTypeList(state),
    cdmVersionList: selectors.getCDMVersionList(state),
    currentListQuery: state.routing.locationBeforeTransitions.query,
    dataSourceId: get(state.modal[form.createDataSource], 'data.id'),
    isLoading: state.cdmSourceList.dataSource.isLoading,
    initialValues: {
      ...dataSourceData,
      dbmsType: get(dataSourceData, 'dbmsType'),
    },
  };
}

const mapDispatchToProps = {
  loadDataSource: actions.cdmSourceList.dataSource.load,
  resetDataSource: actions.cdmSourceList.dataSource.reset,
  createDataSource: actions.cdmSourceList.dataSource.create,
  updateDataSource: actions.cdmSourceList.dataSource.update,
  resetForm: () => resetForm(form.createDataSource),
  closeModal: () => ModalUtils.actions.toggle(modal.createDataSource, false),
  loadDataSourceList: actions.cdmSourceList.dataSourceList.load,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    doSubmit(data) {
      const submitPromise = stateProps.dataSourceId
        ? dispatchProps.updateDataSource(stateProps.dataSourceId, data)
        : dispatchProps.createDataSource(data);

      submitPromise
        .then(() => dispatchProps.resetForm())
        .then(() => dispatchProps.closeModal())
        .then(() => dispatchProps.loadDataSourceList(stateProps.currentListQuery))
        .catch(() => {});

      // We have to return a submission promise back to redux-form
      // to allow it update the state
      return submitPromise;
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
