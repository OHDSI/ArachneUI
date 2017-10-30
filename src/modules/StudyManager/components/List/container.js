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
 * Created: July 25, 2017
 *
 */

// @ts-check
import actions from 'actions';
import { Component, PropTypes } from 'react';
import { get, values } from 'lodash';
import { push } from 'react-router-redux';
import { Utils, ContainerBuilder } from 'services/Utils';
import viewModes from 'const/viewModes';
import { studyListPageSize, studyListPageSizeCards, paths } from 'modules/StudyManager/const';
import Uri from 'urijs';

import getFields from './Filter/fields';
import presenter from './presenter';
import SelectorsBuilder from './selectors';

const selectors = (new SelectorsBuilder()).build();

/** @augments { Component<any, any> } */
export class List extends Component {
  static get propTypes() {
    return {
      query: PropTypes.shape({
        view: PropTypes.string,
      }),
      applySavedFilters: PropTypes.func,
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
    if (nextProps.query !== this.props.query) {
      this.props.loadStudies({
        ...nextProps.query,
        pagesize: nextProps.query.view === viewModes.CARDS ? studyListPageSizeCards : studyListPageSize,
      });
    }
  }

  componentWillUnmount() {
    this.persistFilters();
    window.removeEventListener('beforeunload', this.persistFilters);
  }

  persistFilters() {
    const filterValues = {};
    for (const filter in this.props.query) {
      if (!Utils.isEmpty(this.props.query[filter])) {
        filterValues[filter] = this.props.query[filter];
      }
    }
    actions.studyManager.studyList.saveFilter(filterValues);
  }

  render() {
    return presenter(this.props);
  }
}

export default class ListBuilder extends ContainerBuilder {
  getComponent() {
    return List;
  }

  mapStateToProps(state) {
    const moduleState = state.studyManager;
    const query = state.routing.locationBeforeTransitions.query;
    const isFilteredByMy = query.my;

    return {
      query,
      isLoading: get(moduleState, 'studyList.isLoading', false),
      isFilteredByMy,
      filterFields: getFields({
        typeOptions: selectors.getTypeOptions(state),
        statusOptions: selectors.getStatusOptions(state),
      }),
      paginationDetails: selectors.getPaginationDetails(state),
      searchQueryDecode: ({ searchParams = {}, filterFields }) => {
        return {
          query: searchParams.query,
          page: searchParams.page,
          filter: searchParams,
        };
      },
      searchQueryEncode: ({ searchParams, filterFields }) => {
        return {
          ...searchParams.filter,
          query: searchParams.query,
          page: searchParams.page,
        };
      },
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      loadStudies: actions.studyManager.studyList.find,
      loadTypeList: actions.studyManager.typeList.find,
      loadStatusList: actions.studyManager.statusList.find,
      redirect: addr => push(addr),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      applySavedFilters(filters) {
        const url = new Uri(paths.studies());
        url.setSearch(filters);
        dispatchProps.redirect(url.href());
      },
    };
  }

  getFetchers({ params, state, dispatch }) {
    const query = state.routing.locationBeforeTransitions.query;
    return {
      loadStudies: actions.studyManager.studyList.find.bind(null, {
        ...query,
        pagesize: query.view === viewModes.CARDS ? studyListPageSizeCards : studyListPageSize,
      }),
      loadTypeList: actions.studyManager.typeList.find,
      loadStatusList: actions.studyManager.statusList.find,
    };
  }

}
