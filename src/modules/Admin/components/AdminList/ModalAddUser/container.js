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
 * Created: April 12, 2017
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
import { ContainerBuilder } from 'services/Utils';

class ModalAddUser extends Component {

  static propTypes = {
    isOpened: PropTypes.bool,
    loadAdminOptions: PropTypes.func,
  };

  componentWillReceiveProps(props) {
    if (this.props.isOpened === false && props.isOpened === true) {
      this.props.loadAdminOptions({
        query: '',
      });
    }
  }

  render() {
    return presenter(this.props);
  }
}

class ModalAddUserBuilder extends ContainerBuilder {

  getComponent(){
    return ModalAddUser;
  }

  mapStateToProps(state) {
    return {
      isOpened: get(state, `modal.${modal.addAdminUser}.isOpened`, false),
      adminOptions: selectors.getAdminOptionList(state),
    };
  }

  getMapDispatchToProps() {
    return {
      addAdmin: actions.adminSettings.adminList.create,
      loadAdminOptions: actions.adminSettings.adminOptionList.query,
      loadAdminList: actions.adminSettings.adminList.query,
      closeModal: () => ModalUtils.actions.toggle(modal.addAdminUser, false),
      resetForm: resetForm.bind(null, forms.addAdminUser),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return Object.assign({
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      doSubmit({ userId }) {
        const submitPromise = dispatchProps.addAdmin({ id: userId });

        submitPromise
          .then(dispatchProps.loadAdminList)
          .then(dispatchProps.resetForm)
          .then(dispatchProps.closeModal)
          .catch(() => {
          });

        return submitPromise;
      },
    });
  }

  getModalParams() {
    return {
      name: modal.addAdminUser,
    }
  }

  getFormParams() {
    return {
      form: forms.addAdminUser,
    }
  }
}


export default ModalAddUserBuilder;
