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
 * Created: July 25, 2017
 *
 */

// @ts-check
import actions from 'actions';
import { Component, PropTypes } from 'react';
import { push } from 'react-router-redux';
import { Utils, get } from 'services/Utils';
import viewModes from 'const/viewModes';
import { studyListPageSize, studyListPageSizeCards, paths, studyKind } from 'modules/StudyManager/const';
import Uri from 'urijs';
import isEmpty from 'lodash/isEmpty';
import getFields from './Filter/fields';
import presenter from './presenter';
import SelectorsBuilder from './selectors';
import { ActiveModuleAwareContainerBuilder } from 'modules/StudyManager/utils';

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
    window.addEventListener('beforeunload', this.onUnmount);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.query !== this.props.query) {
      this.props.loadStudies({
        ...nextProps.query,
        pagesize: nextProps.query.view === viewModes.CARDS ? studyListPageSizeCards : studyListPageSize,
      });
    }
    if (nextProps.pathname !== this.props.pathname) {
      const toDetails = new RegExp(paths.studies()).test(nextProps.pathname);
      this.persistFilters({
        ...nextProps.query,
        page: toDetails ? nextProps.query.page : 1,
      });
    } else if (nextProps.query.view !== this.props.query.view
      || nextProps.pathname === paths.studies()
    ) {
      // if we changed view mode or clicked on study manager in side bar
      this.persistFilters(nextProps.query);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onUnmount);
  }

  onUnmount() {
    this.persistFilters({
      ...this.props.query,
      page: 1,
    });
  }

  persistFilters(query) {
    const filterValues = {};
    for (const filter in query) {
      if (!Utils.isEmpty(query[filter])) {
        filterValues[filter] = query[filter];
      }
    }
    actions.studyManager.studyList.saveFilter(filterValues);
  }

  render() {
    return presenter(this.props);
  }
}

export default class ListBuilder extends ActiveModuleAwareContainerBuilder {
  
  getComponent() {
    return List;
  }

  mapStateToProps(state, ownProps) {
    const moduleState = state.studyManager;
    const query = ownProps.location.query;
    const isFilteredByMy = query.my;
    const pathname = get(state, 'routing.locationBeforeTransitions.pathname', '', 'String');

    return {
      query,
      isLoading: get(moduleState, 'studyList.isLoading', false),
      isFilteredByMy,
      filterFields: getFields({
        typeOptions: selectors.getTypeOptions(state),
        statusOptions: selectors.getStatusOptions(state),
      }),
      paginationDetails: selectors.getPaginationDetails(state),
      pathname,
      ...Utils.getPlainFiltersEncodeDecoder(),
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

  getFetchers({ params, dispatch, getState }) {
    this.setKind('study-manager');
    const query = getState().routing.locationBeforeTransitions.query;
    return {
      ...super.getFetchers({ params, getState, dispatch }),
      loadStudies: actions.studyManager.studyList.find.bind(null, {
        ...query,
        pagesize: query.view === viewModes.CARDS ? studyListPageSizeCards : studyListPageSize,
      }),
      loadTypeList: actions.studyManager.typeList.find,
      loadStatusList: actions.studyManager.statusList.find,
    };
  }

}
