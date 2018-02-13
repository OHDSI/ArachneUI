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
import presenter from './presenter';
import SelectorsBuilder from './selectors';

const selectors = (new SelectorsBuilder()).build();

export class MyDatasources extends Component {
  static get propTypes() {
    return {
      loadDsList: PropTypes.func,
    };
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
    return {
      filterFields: [], // selectors.getFilterList(state),
      columns: selectors.getColumns(state),
      data: selectors.getData(state),
      isLoading: get(state, 'dataCatalog.myDatasources.isLoading', false),
      paginationDetails: selectors.getPaginationDetails(state),
      ...filterListEncoderDecoder,
    };
  }

  /**
   * @returns { { [x: string]: any } }
   */
  getMapDispatchToProps() {
    return {
      loadDsList: actions.dataCatalog.myDatasources.query,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
    };
  }

  getFetchers({ params, state, dispatch }) {
    return {
      loadDsList: dispatch(actions.dataCatalog.myDatasources.query()),
    };
  }

}
