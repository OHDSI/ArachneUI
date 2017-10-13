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
import { reset as resetForm } from 'redux-form';
import get from 'lodash/get';
import actions from 'actions/index';
import { ModalUtils } from 'arachne-ui-components';
import { forms, modal } from 'modules/Admin/const';
import presenter from './presenter';
import selectors from './selectors';
import authActions from 'modules/Auth/actions/index';
import { buildFormData, ContainerBuilder } from 'services/Utils';

class ModalAddUser extends Component {

  static propTypes() {
    return {
      isOpened: PropTypes.bool,
      loadUserOptions: PropTypes.func,
    };
  }

  componentWillMount() {
    this.props.loadProfessionalTypes();
  }

  render() {
    return presenter(this.props);
  }
}

class ModalPortalUserListBuilder extends ContainerBuilder {

  getComponent() {
    return ModalAddUser;
  }

  mapStateToProps(state) {

    const { pathname, query } = state.routing.locationBeforeTransitions;
    return {
      isOpened: get(state, `modal.${modal.addUser}.isOpened`, false),
      userOptions: selectors.getUserOptionList(state),
      professionalTypesOptions: selectors.getProfessionalTypes(state),
      pathname,
      query,
    };
  }

  getMapDispatchToProps() {
    return {
      addUser: actions.adminSettings.portalUserList.create,
      loadUserOptions: actions.adminSettings.userOptionList.query,
      loadUserList: actions.adminSettings.portalUserList.query,
      closeModal: () => ModalUtils.actions.toggle(modal.addUser, false),
      resetForm: resetForm.bind(null, forms.addUser),
      loadProfessionalTypes: authActions.professionalTypes.loadList,
      loadUsersWithCurrentQuery: (query) => actions.adminSettings.portalUserList.query({ query }),
    }
  }


  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      doSubmit(data) {
        const query = { type: stateProps.type };
        const submitPromise = dispatchProps.addUser({ id: null, query }, data);

        submitPromise
          .then(() => dispatchProps.loadUsersWithCurrentQuery(stateProps.query))
          .then(dispatchProps.resetForm)
          .then(dispatchProps.closeModal)
          .catch(() => {
          });

        return submitPromise;
      },
    };
  }

  getModalParams() {
    return {
      name: modal.addUser,
    };
  }

  getFormParams() {
    return {
      form: forms.addUser,
    }
  }
}

export default ModalPortalUserListBuilder;