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
 * Created: July 19, 2017
 *
 */

// @ts-check
import { Component, PropTypes } from 'react';
import { Utils, ContainerBuilder, get } from 'services/Utils';
import actions from 'actions';
import { push } from 'react-router-redux';
import Uri from 'urijs';
import { paths } from 'modules/InsightsLibrary/const';
import { saveFilter } from 'modules/InsightsLibrary/ducks/insights';
import { viewModes, viewModePageSize } from 'const/viewModes';
import presenter from './presenter';
import getFields from './Filters/fields';
import SelectorsBuilder from './selectors';

const selectors = (new SelectorsBuilder()).build();

/** @augments { Component<any, any> } */
class InsightsList extends Component {
  static get propTypes() {
    return {
      searchQuery: PropTypes.string,
      loadInsightsWithCurrentQuery: PropTypes.func,
    };
  }

  constructor(props, context) {
    super(props, context);

    this.persistFilters = this.persistFilters.bind(this);
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.persistFilters);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.searchQuery !== nextProps.searchQuery) {
      nextProps.loadInsightsWithCurrentQuery();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.persistFilters);
    this.persistFilters();
  }

  persistFilters() {
    const filterValues = {};
    for (const filter in this.props.searchQuery) {
      if (!Utils.isEmpty(this.props.searchQuery[filter])) {
        filterValues[filter] = this.props.searchQuery[filter];
      }
    }
    saveFilter(filterValues);
  }

  render() {
    return presenter(this.props);
  }
}

export default class InsightsListBuilder extends ContainerBuilder {
  getComponent() {
    return InsightsList;
  }

  mapStateToProps(state) {
    const searchQuery = get(state, 'routing.locationBeforeTransitions.query', {}, 'Object');

    return {
      searchQuery,
      isLoading: get(state, 'insightsLibrary.insights.isLoading', false),
      filterFields: getFields(),
      paginationDetails: selectors.getPaginationDetails(state),
      ...Utils.getPlainFiltersEncodeDecoder(),
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      loadInsights: actions.insightsLibrary.insights.query,
      redirect: addr => push(addr),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      loadInsightsWithCurrentQuery: () => {
        const pageSize = viewModePageSize[get(stateProps.searchQuery, 'view') || viewModes.TABLE];
        dispatchProps.loadInsights(null, { ...stateProps.searchQuery, pageSize });
      },
      applySavedFilters(filters) {
        const url = new Uri(paths.insights());
        url.setSearch(filters);
        dispatchProps.redirect(url.href());
      },
    };
  }
  getFetchers({ params, state, dispatch }) {
    const load = actions.insightsLibrary.insights.query;
    const query = state.routing.locationBeforeTransitions.query;
    const pageSize = viewModePageSize[get(query, 'view') || viewModes.TABLE];
    return {
      load: () => load(null, { ...query, pageSize }),
    };
  }

}
