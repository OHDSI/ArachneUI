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

import { Component, PropTypes } from 'react';
import { reset as resetForm } from 'redux-form';
import get from 'lodash/get';
import actions from 'actions/index';
import { ModalUtils } from 'arachne-components';
import { forms, modal } from 'modules/Admin/const';
import presenter from './presenter';
import selectors from './selectors';
import { ContainerBuilder } from 'services/Utils';

class ModalAddUser extends Component {
  static propTypes = {
    isOpened: PropTypes.bool,
    loadUserOptions: PropTypes.func,
  };

  componentWillReceiveProps(props) {
    if (this.props.isOpened === false && props.isOpened === true) {
      this.props.loadUserOptions({
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
      isOpened: get(state, `modal.${modal.addUser}.isOpened`, false),
      userOptions: selectors.getUserOptionList(state),
    };
  }

  getMapDispatchToProps() {
    return {
      addUser: actions.adminSettings.userList.create,
      loadUserOptions: actions.adminSettings.userOptionList.query,
      loadUserList: actions.adminSettings.userList.query,
      closeModal: () => ModalUtils.actions.toggle(modal.addUser, false),
      resetForm: resetForm.bind(null, forms.addUser),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return Object.assign({
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      doSubmit({ userId }) {
        const submitPromise = dispatchProps.addUser({ id: userId });

        submitPromise
          .then(dispatchProps.loadUserList)
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
      name: modal.addUser,
    }
  }

  getFormParams() {
    return {
      form: forms.addUser,
    }
  }
}

export default ModalAddUserBuilder;
