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
 * Created: December 14, 2016
 *
 */

import { Component, PropTypes } from 'react';
import actions from 'actions';
import get from 'lodash/get';
import { ContainerBuilder } from 'services/Utils';
import {
  filterListEncoderDecoder,
} from 'services/SolrQuery';
import presenter from './presenter';
import SelectorsBuilder from './selectors';
import { paths } from 'modules/DataCatalog/const';

const selectors = (new SelectorsBuilder()).build();

function formatSearchString(searchStr) {
  const resultString = {};
  if (searchStr) {
    Object.keys(searchStr).forEach((filterName) => {
      /*
        Redux form behaves suspiciously when you use integers as Field name
        It treats objects with Integer field as Array and it leads to errors,
        And because we use Integer fields in our metadata fields
        decided to escape fields with prefix 'f_'
       */
      resultString[filterName.replace(/^(filter\[f_)/, 'filter[')] = searchStr[filterName];
    });
  }
  return resultString;
}

/** @augments { Component<any, any> } */
class DataCatalogStatefulList extends Component {
  static propTypes() {
    return {
      searchStr: PropTypes.string,
      loadDsList: PropTypes.func.isRequired,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.searchStr !== nextProps.searchStr) {
      const searchStr = formatSearchString({ ...nextProps.searchStr });
      this.props.loadDsList({
        searchStr,
        onlyMy: nextProps.onlyMy,
      });
    }
  }

  render() {
    return presenter(this.props);
  }
}

class DataCatalogListBuilder extends ContainerBuilder {

  getComponent() {
    return DataCatalogStatefulList;
  }

  mapStateToProps(state) {
    return {
      searchStr: selectors.getSearchStr(state),
      filterFields: selectors.getFilterList(state),
      columns: selectors.getColumns(state),
      data: selectors.getData(state),
      isLoading: get(state, 'dataCatalog.dataSourceList.isLoading', false),
      paginationDetails: selectors.getPaginationDetails(state),
      ...filterListEncoderDecoder,
    };
  }

  getMapDispatchToProps() {
    return {
      loadDsList: actions.dataCatalog.dataSourceList.query,
    };
  }

  getFetchers({ state }) {
    const searchStr = formatSearchString(state.routing.locationBeforeTransitions.query);
    return {
      loadDsList: actions.dataCatalog.dataSourceList.query.bind(null, { searchStr }),
    };
  }

}

export default DataCatalogListBuilder;
export {
  DataCatalogStatefulList,
};
