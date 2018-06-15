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
 * Created: June 14, 2017
 *
 */

import { connect } from 'react-redux';
import { ModalUtils } from 'arachne-ui-components';
import {
  modal,
  paths,
} from 'modules/DataCatalog/const';
import { push as goToPage } from 'react-router-redux';
import { get } from 'services/Utils';
import Actions from './presenter';

function mapStateToProps(state, ownProps) {
  return {
    isProfileSelected: ownProps.isProfileSelected,
    isVirtual: get(state, 'dataCatalog.dataSource.data.result.dataNode.virtual', false),
  };
}

const mapDispatchToProps = {
  openAddModal: ModalUtils.actions.toggle.bind(null, modal.inviteDataSource, true),
  changeTab: address => goToPage(address),
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    onChangeTab: tab => dispatchProps.changeTab(`${paths.dataCatalog(ownProps.dataSourceId)}/${tab}`),
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Actions);
