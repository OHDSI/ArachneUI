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
import { validators } from 'services/Utils';
import Modal from './presenter';
import selectors from '../selectors';
import authActions from 'modules/Auth/ducks/index';
import { buildFormData, ContainerBuilder } from 'services/Utils';

class ModalAddUsersToTenantBuilder extends ContainerBuilder {

  getComponent() {
    return Modal;
  }

  mapStateToProps(state) {

    return {
      selectedUsers: selectors.getSelectedUsers(state),
    };
  }

  getMapDispatchToProps() {
    return {
    }
  }


  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
    };
  }

  getModalParams() {
    return {
      name: modal.addUsersToTenants,
    };
  }

  // getFormParams() {
  //   return {
  //     form: forms.addUser,
  //     validate: validators.checkPassword,
  //   }
  // }
}

export default ModalAddUsersToTenantBuilder;