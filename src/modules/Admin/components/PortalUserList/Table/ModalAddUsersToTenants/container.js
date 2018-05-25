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
 * Created: May 24, 2018
 */

import { Component, PropTypes } from 'react';
import { reset as resetForm } from 'redux-form';
import get from 'lodash/get';
import actions from 'actions/index';
import { ModalUtils } from 'arachne-ui-components';
import { forms, modal } from 'modules/Admin/const';
import Modal from './presenter';
import tableSelectors from '../selectors';
import UserListSelectorBuilder from 'modules/Admin/components/PortalUserList/selectors';
import { buildFormData, ContainerBuilder } from 'services/Utils';

const gridSelectors = new UserListSelectorBuilder().build();

class ModalAddUsersToTenantBuilder extends ContainerBuilder {

  getComponent() {
    return Modal;
  }

  mapStateToProps(state) {

    return {
      selectedUsers: tableSelectors.getSelectedUsers(state),
      tenantOptions: gridSelectors.getTenantOptions(state),
    };
  }

  getMapDispatchToProps() {
    return {
      closeModal: () => ModalUtils.actions.toggle(modal.addUsersToTenants, false),
      addToTenants: actions.adminSettings.portalUserList.addToTenants,
    }
  }


  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      doSubmit: (data) => {
        dispatchProps.addToTenants(null, { ...data, userIds: stateProps.selectedUsers });
      }
    };
  }

  getModalParams() {
    return {
      name: modal.addUsersToTenants,
    };
  }

  getFormParams() {
    return {
      form: forms.addUsersToTenants,
    }
  }
}

export default ModalAddUsersToTenantBuilder;