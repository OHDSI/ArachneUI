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

import actions from 'actions/index';
import { asyncConnect } from 'redux-async-connect';
import { Utils } from 'services/Utils';
import presenter from './presenter';

class List extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.query !== this.props.query) {
      this.props.loadDataSourceList({}, nextProps.query);
      this.props.queryDbmsTypes();
    }
  }

  render() {
    return presenter(this.props);
  }
}

List.propTypes = {
  query: PropTypes.object, //eslint-disable-line
  loadDataSourceList: PropTypes.func.isRequired,
  queryDbmsTypes: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const moduleState = state.cdmSourceList;

  return {
    query: state.routing.locationBeforeTransitions.query,
    isLoading: moduleState.dataSourceList.isLoading,
  };
}

const mapDispatchToProps = {
  loadDataSourceList: actions.cdmSourceList.dataSourceList.query,
  queryDbmsTypes: actions.cdmSourceList.dbmsTypes.query,
};

const connectedList = connect(mapStateToProps, mapDispatchToProps)(List);

export default asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => {
    const state = getState();
    const query = state.routing.locationBeforeTransitions.query;
    const fetchers = {
      load: () => actions.cdmSourceList.dataSourceList.query({}, { query }),
      loadDbmsTypes: actions.cdmSourceList.dbmsTypes.query,
    };
    return Utils.fetchAll({ fetchers, dispatch });
  },
}])(connectedList);
