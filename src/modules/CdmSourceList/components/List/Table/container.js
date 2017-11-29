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
 * Created: December 20, 2016
 *
 */

import { connect } from 'react-redux';
import { push as goToPage } from 'react-router-redux';
import { ModalUtils } from 'arachne-ui-components';
import { modal, paths } from 'modules/CdmSourceList/const';
import actions from 'actions';
import Table from './presenter';
import selectors from './selectors';

function getSorting(location) {
  return {
    sortBy: location.query.sortBy || 'name',
    sortAsc: location.query.sortAsc === 'true',
  };
}

function mapStateToProps(state) {
  const query = state.routing.locationBeforeTransitions.query;
  return {
    query,
    dataSourceList: selectors.getDataSourceList(state),
    sorting: getSorting(state.routing.locationBeforeTransitions),
  };
}

const mapDispatchToProps = {
  editDataSource: id => ModalUtils.actions.toggle(modal.createDataSource, true, { id }),
  remove: actions.cdmSourceList.dataSource.delete,
  goToDataSource: id => goToPage(paths.dataSources(id)),
  setSearch: actions.router.setSearch,
  loadList: actions.cdmSourceList.dataSourceList.query
};

function mergeProps(state, dispatch, ownProps) {

  return {
    ...state,
    ...dispatch,
    ...ownProps,
    remove(id) {
      dispatch.remove({ id }).then(function () {
        dispatch.loadList({}, { query: state.query });
      })
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Table);
