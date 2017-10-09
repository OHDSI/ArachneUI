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
 * Created: April 24, 2017
 *
 */

import actions from 'actions/index';
import { ContainerBuilder, Utils } from 'services/Utils';
import UserTable from './presenter';
import selectors from './selectors';

function getSorting(location) {
  return {
    sortBy: location.query.sortBy || 'name',
    sortAsc: (
      typeof location.query.sortAsc === 'undefined'
      || location.query.sortAsc === 'true'
    ),
  };
}

class UserListTableBuilder extends ContainerBuilder {

  getComponent(){
    return UserTable;
  }

  mapStateToProps(state) {
    return {
      userList: selectors.getUserList(state),
      sorting: getSorting(state.routing.locationBeforeTransitions),
    };
  }

  getMapDispatchToProps() {
    return {
      loadList: actions.adminSettings.userList.query,
      removeUser: actions.adminSettings.userList.delete,
      setSearch: actions.router.setSearch,
    };
  }

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
              .then(dispatchProps.loadList)
              .catch(() => {
              });
          });
      },
    };
  }
}

export default UserListTableBuilder;