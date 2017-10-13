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
 * Created: September 29, 2017
 *
 */

import { Component, PropTypes } from 'react';
import { ModalUtils } from 'arachne-ui-components';
import { modal, paths } from 'modules/Admin/const';
import actions from 'actions';
import presenter from './presenter';
import { ContainerBuilder, get, Utils } from 'services/Utils';
import UserListSelectorBuilder from './selectors';
import userFilterFields from './Filters';
import { saveFilter, getSavedFilter } from "modules/Admin/ducks/portalUserList";
import { values } from 'lodash';
import Uri from 'urijs';
import { push } from 'react-router-redux';

const selectors = new UserListSelectorBuilder().build();

class UserList extends Component {

  static propTypes = {
    loadUserList: PropTypes.func,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.query !== this.props.query) {
      nextProps.loadUsersWithCurrentQuery();
    }
  }

  componentWillMount() {
    const preSelectedFilters = Object.values(this.props.query)
      .filter(param => !Utils.isEmpty(param));
    if (!preSelectedFilters.length) {
      const savedFilter = getSavedFilter();
      if (values(savedFilter).filter(param => !Utils.isEmpty(param))) {
        this.props.applySavedFilters(savedFilter);
      }
    }
  }

  componentWillUnmount() {
    const filterValues = {};
    for (const filter in this.props.query) {
      if (!Utils.isEmpty(this.props.query[filter])) {
        filterValues[filter] = this.props.query[filter];
      }
    }
    saveFilter(filterValues);
  }

  render() {
    return presenter(this.props);
  }
}

class UserListBuilder extends ContainerBuilder {

  getComponent() {
    return UserList;
  }

  mapStateToProps(state) {
    return {
      isLoading: state.adminSettings.portalUserList.isLoading,
      query: get(state, 'routing.locationBeforeTransitions.query', {}, 'Object'),
      paginationDetails: selectors.getPaginationDetails(state),
      filterFields: userFilterFields,
    };
  }

  getMapDispatchToProps() {
    return {
      loadUserList: actions.adminSettings.portalUserList.query,
      openModal: () => ModalUtils.actions.toggle(modal.addUser, true),
      redirect: addr => push(addr),
    }
  };

  mergeProps(stateProps, dispatchProps, ownProps){
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      loadUsersWithCurrentQuery: () => {
        dispatchProps.loadUserList({query: stateProps.query});
      },
      applySavedFilters(filters) {
        const url = new Uri(paths.users());
        url.setSearch(filters);
        dispatchProps.redirect(url.href());
      },
    };
  }

  getFetchers({ params, state, dispatch }) {
    const query = get(state, 'routing.locationBeforeTransitions.query', {}, 'Object');
    return {
      loadUsers: actions.adminSettings.portalUserList.query.bind(null, { query }),
    };
  }
}

export default UserListBuilder;
