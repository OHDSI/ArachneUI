/*
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
 * Authors: Anton Gackovka
 * Created: May 23, 2018
 */

import actions from 'actions/index';
import { get, ContainerBuilder, Utils } from 'services/Utils';
import UserTable from './presenter';
import { order } from 'const/sorting';
import { push as goToPage } from 'react-router-redux';
import URI from 'urijs';
import split from 'lodash/split';
import selectors from '../selectors';
import { ModalUtils } from 'arachne-ui-components';
import { modal, paths } from 'modules/Admin/const';


class UserListActionsToolbarBuilder extends ContainerBuilder {

  getComponent() {
    return UserTable;
  }

  mapStateToProps(state) {
    return {
      selectedUsers: selectors.getSelectedUsers(state),
    };
  }

  getMapDispatchToProps() {
    return {
      batchDeleteAction: actions.adminSettings.portalUserList.batchDelete,
      openAddUsersToTenantsModal: () => ModalUtils.actions.toggle(modal.addUsersToTenants, true),
    }
  };

  mergeProps(stateProps, dispatchProps, ownProps) {

    return {
      ...stateProps,
      ...ownProps,
      ...dispatchProps,
      batchDelete: () => dispatchProps.batchDeleteAction(null, {ids: stateProps.selectedUsers})
    };
  }
}

export default UserListActionsToolbarBuilder;
