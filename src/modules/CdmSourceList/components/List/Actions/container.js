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

import { connect } from 'react-redux';

import actions from 'actions/index';
import { ModalUtils } from 'arachne-ui-components';
import { modal } from 'modules/CdmSourceList/const';
import Actions from './presenter';

function mapStateToProps(state) {
  return {
    currentQuery: state.routing.locationBeforeTransitions.query,
  };
}

const mapDispatchToProps = {
  openCreateSourceModal: () => ModalUtils.actions.toggle(modal.createDataSource, true, { id: null }),
  openCreateDataNodeModal: () => ModalUtils.actions.toggle(modal.createDataNode, true),
  loadList: actions.cdmSourceList.dataSourceList.load,
  loadDataNode: actions.cdmSourceList.dataNode.load,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    reloadList() {
      dispatchProps.loadList(stateProps.currentQuery);
    },
    startCreatingDataSource: () => {
      dispatchProps.loadDataNode()
        .then(dispatchProps.openCreateSourceModal)
        .catch(dispatchProps.openCreateDataNodeModal);
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Actions);
