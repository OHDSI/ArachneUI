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
 * Created: April 21, 2017
 *
 */

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm, reset as resetForm } from 'redux-form';
import get from 'lodash/get';

import actions from 'actions/index';
import { ModalUtils } from 'arachne-components';
import { modal, form } from 'modules/CdmSourceList/const';
import presenter from './presenter';

class ModalCreateDataNode extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpened !== this.props.isOpened) {
      this.props.reset();
    }
  }

  render() {
    return presenter(this.props);
  }
}

ModalCreateDataNode.propTypes = {
  isOpened: PropTypes.bool,
  reset: PropTypes.func,
};

function mapStateToProps(state) {
  const isOpened = get(state, 'modal.createDataNode.isOpened', false);
  const isLoading = get(state, 'cdmSourceList.dataNode.isLoading', false);

  return {
    isOpened,
    isLoading,
  };
}

const mapDispatchToProps = {
  reset: () => resetForm(form.createDataNode),
  closeModal: () => ModalUtils.actions.toggle(modal.createDataNode, false),
  openCreateSourceModal: () => ModalUtils.actions.toggle(modal.createDataSource, true, { id: null }),
  create: actions.cdmSourceList.dataNode.create,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    doSubmit(data) {
      const submitPromise = dispatchProps.create(data);

      submitPromise
        .then(() => dispatchProps.reset())
        .then(() => {
          dispatchProps.closeModal();
          dispatchProps.openCreateSourceModal();
        })
        .catch(() => {});

      // We have to return a submission promise back to redux-form
      // to allow it update the state
      return submitPromise;
    },
  });
}

let ReduxModalCreateEdit = reduxForm({
  form: form.createDataNode,
  enableReinitialize: true,
})(ModalCreateDataNode);

ReduxModalCreateEdit = ModalUtils.connect({
  name: modal.createDataNode,
})(ReduxModalCreateEdit);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxModalCreateEdit);
