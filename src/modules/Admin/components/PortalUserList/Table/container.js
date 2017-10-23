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
 * Created: September 29, 2017
 *
 */

import actions from 'actions/index';
import { get, ContainerBuilder, Utils } from 'services/Utils';
import UserTable from './presenter';
import selectors from './selectors';
import { order } from 'const/sorting';
import { push as goToPage } from 'react-router-redux';
import URI from 'urijs';
import { split } from 'lodash';

class UserListTableBuilder extends ContainerBuilder {

  getComponent() {
    return UserTable;
  }

  mapStateToProps(state) {

    const { pathname, query } = state.routing.locationBeforeTransitions;
    const querySort = query.sort ? split(query.sort, ',', 2) : 'name,asc';
    const sortBy = querySort[0] || name;
    const sortAsc = querySort[1] ? querySort[1] === order.asc : order.desc;

    return {
      userList: selectors.getUserList(state),
      sorting: {
        sortBy: sortBy,
        sortAsc: sortAsc,
      },
      pathname,
      query,
    };
  }

  getMapDispatchToProps() {
    return {
      loadList: actions.adminSettings.portalUserList.find,
      removeUser: actions.adminSettings.portalUserList.delete,
      enableUser: actions.adminSettings.portalUserEnable.create,
      confirmEmail: actions.adminSettings.portalUserConfirmEmail.create,
      setSearch: actions.router.setSearch,
      search: goToPage,
      loadUsersWithCurrentQuery: (query) => actions.adminSettings.portalUserList.query({ query }),
    }
  };

  mergeProps(stateProps, dispatchProps, ownProps) {

    return {
      ...stateProps,
      ...ownProps,
      ...dispatchProps,
      removeUser: (id) => {
        Utils.confirmDelete()
          .then(() => {
            dispatchProps
              .removeUser({ id })
              .then(() => dispatchProps.loadUsersWithCurrentQuery(stateProps.query))
              .catch(() => {
              });
          });
      },
      enablePortalUser: (id, enable) => {
        dispatchProps
          .enableUser({ id, enable })
          .then(() => dispatchProps.loadUsersWithCurrentQuery(stateProps.query))
          .catch(() => {
          });
      },
      confirmEmail: (id, confirm) => {
        dispatchProps
          .confirmEmail({ id, confirm })
          .then(() => dispatchProps.loadUsersWithCurrentQuery(stateProps.query))
          .catch(() => {
          });
      },
      setSorting: (sortParams) => {
        const uri = new URI(stateProps.pathname);
        uri.setSearch({
          ...stateProps.query,
          sort: sortParams.sortBy + ',' + (sortParams.sortAsc ? order.asc : order.desc),
        });
        dispatchProps.search(uri.toString());
      },
    };
  }
}

export default UserListTableBuilder;
