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
 * Created: February 14, 2017
 *
 */

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';

import actions from 'actions';
import { ModalUtils } from 'arachne-components';
import { modal } from 'modules/AnalysisExecution/const';

import presenter from './presenter';
import selectors from './selectors';

class ModalStatusHistory extends Component {
  componentWillReceiveProps(props) {
    if (props.submissionId && !this.props.isOpened && props.isOpened === true) {
      this.props.loadHistory({ submissionId: props.submissionId });
    }
  }

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state) {
  const submissionId = get(state, 'modal.statusHistory.data.submissionId');
  const isLoading = get(state, 'analysisExecution.statusHistory.isLoading');
  const isOpened = get(state, 'modal.statusHistory.isOpened', false);
  const listStatuses = selectors.getStatusList(state);

  return {
    listStatuses,
    submissionId,
    isOpened,
    isLoading,
  };
}

const mapDispatchToProps = {
  closeModal: () => ModalUtils.actions.toggle(modal.statusHistory, false),
  loadHistory: actions.analysisExecution.statusHistory.query,
};

const ReduxModalStatusHistory = ModalUtils.connect({
  name: modal.statusHistory,
})(ModalStatusHistory);

ModalStatusHistory.propTypes = {
  loadHistory: PropTypes.func,
  isOpened: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReduxModalStatusHistory);
