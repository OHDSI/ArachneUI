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
import ActionsToolbar from './presenter';
import { push as goToPage } from 'react-router-redux';
import URI from 'urijs';
import split from 'lodash/split';
import selectors from '../selectors';
import { ModalUtils } from 'arachne-ui-components';
import { modal, batchOperationType } from 'modules/Admin/const';

class UserListActionsToolbarBuilder extends ContainerBuilder {

  getComponent() {
    return ActionsToolbar;
  }

  mapStateToProps(state) {
    const { pathname, query } = state.routing.locationBeforeTransitions;
    return {
      selectedUsers: selectors.getSelectedUsers(state),
      query,
      pathname,
    };
  }

  getMapDispatchToProps() {
    return {
      batch: actions.adminSettings.portalUserList.batchOperation,
      loadUsersWithCurrentQuery: (query) => actions.adminSettings.portalUserList.query({ query }),
      cleanSelectedUsers: () => actions.adminSettings.portalUserList.updateSelectedUsers({}),
    }
  };

  
  mergeProps(stateProps, dispatchProps, ownProps) {

    const messages = {
      [batchOperationType.ENABLE]: "toggle enabled flag for",
      [batchOperationType.DELETE]: "delete",
      [batchOperationType.RESEND]: "render confirmation email to",
      [batchOperationType.CONFIRM]: "toggle confirmed flag for",
    };
    
    return {
      ...stateProps,
      ...ownProps,
      ...dispatchProps,
      batch: (operationType) => {
        Utils.confirmDelete({message: `Are you sure you want to ${messages[operationType]} the selected users?`})
          .then(() => dispatchProps.batch(null, {
            type: operationType,
            ids: stateProps.selectedUsers,
          }))
          .then(() => dispatchProps.loadUsersWithCurrentQuery(stateProps.query))
          .then(() => operationType === batchOperationType.DELETE ? dispatchProps.cleanSelectedUsers() : {})
          .catch(() => {});
      },
    }
  }
}

export default UserListActionsToolbarBuilder;
