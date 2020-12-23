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
  * Created: Tuesday, February 13, 2018 5:37 PM
  *
  */

//@ts-check
import { Component, PropTypes } from 'react';
import actions from 'actions';
import { ContainerBuilder, get } from 'services/Utils';
import {
  filterListEncoderDecoder,
} from 'services/SolrQuery';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import { replace } from 'react-router-redux';
import presenter from './presenter';
import SelectorsBuilder from './selectors';
import { paths } from 'modules/DataCatalog/const';

const selectors = (new SelectorsBuilder()).build();
const defaultQueryParams = { query: '', page: 1, pageSize: 10 };

/** @augments { Component<any, any> } */
export class MyDatasources extends Component {
  static get propTypes() {
    return {
      loadDsList: PropTypes.func,
      queryParams: PropTypes.object,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.queryParams, nextProps.queryParams)) {
      this.props.loadDsList(null, nextProps.queryParams);
    }
  }

  render() {
    return presenter(this.props);
  }
}
 
export default class MyDatasourcesBuilder extends ContainerBuilder {
  getComponent() {
    return MyDatasources;
  }  
 
  mapStateToProps(state) {
    const queryParams = get(state, 'routing.locationBeforeTransitions.query');

    return {
      filterFields: [],
      columns: selectors.getColumns(state),
      data: selectors.getData(state),
      isLoading: get(state, 'dataCatalog.myDatasources.isLoading', false),
      paginationDetails: selectors.getPaginationDetails(state),
      ...filterListEncoderDecoder,
      queryParams: isEmpty(queryParams) ? defaultQueryParams : queryParams,
    };
  }

  /**
   * @returns { { [x: string]: any } }
   */
  getMapDispatchToProps() {
    return {
      loadDsList: actions.dataCatalog.myDatasources.query,
      redirect: addr => replace(addr),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      onPageOutOfRange() {
        dispatchProps.redirect(paths.myDatasources());
      }
    };
  }

  getFetchers({ params, state, dispatch }) {
    const queryParams = get(state, 'routing.locationBeforeTransitions.query');

    return {
      loadDsList: dispatch(actions.dataCatalog.myDatasources.query(
        null,
        isEmpty(queryParams) ? defaultQueryParams : queryParams)
      ),
    };
  }

}
