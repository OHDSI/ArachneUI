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
 * Created: January 16, 2017
 *
 */

import actions from 'actions';
import { Component, PropTypes } from 'react';
import {
  filterListEncoderDecoder,
} from 'services/SolrQuery';
import { ContainerBuilder, get } from 'services/Utils';
import presenter from './presenter';
import selectors from './selectors';

class ExpertsList extends Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.searchStr !== nextProps.searchStr) {
      nextProps.loadList(nextProps.searchStr);
    }
  }
  render() {
    return presenter(this.props);
  }
}

ExpertsList.propTypes = {
  loadList: PropTypes.func,
  loadProfessionalTypes: PropTypes.func,
  searchStr: PropTypes.string,
};

/** @augments { Component<any, any> } */
export default class ExpertsListBuilder extends ContainerBuilder {
  getComponent() {
    return ExpertsList;
  }

  mapStateToProps(state) {
    const moduleState = state.expertFinder;

    return {
      searchStr: state.routing.locationBeforeTransitions.search,
      isLoading: get(moduleState, 'expertsList.list.isLoading', false),
      filterFields: selectors.getFilterList(state),
      paginationDetails: selectors.getPaginationDetails(state),
      ...filterListEncoderDecoder,
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      loadList: actions.expertFinder.expertsList.load,
      loadProfessionalTypes: actions.expertFinder.professionalTypes.getProfessionalTypes,
    };
  }

  getFetchers({ params, state, dispatch }) {
    const searchStr = state.routing.locationBeforeTransitions.search;
    return {
      loadList: actions.expertFinder.expertsList.load.bind(null, searchStr),
      loadProfessionalTypes: actions.expertFinder.professionalTypes.getProfessionalTypes,
    };
  }

}
