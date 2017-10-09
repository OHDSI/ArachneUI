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
import { ModalUtils } from 'arachne-components';
import { modal } from 'modules/Admin/const';
import { ContainerBuilder, get } from 'services/Utils';
import actions from 'actions/index';
import presenter from './presenter';

class UserList extends Component {
  static propTypes = {
    loadUserList: PropTypes.func,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.query !== this.props.query) {
      this.props.loadUserList({ query: nextProps.query });
    }
  }

  render() {
    return presenter(this.props);
  }
}

class UserListBuilder extends ContainerBuilder {

  getComponent(){
    return UserList;
  }

  mapStateToProps(state) {
    return {
      isLoading: state.adminSettings.userList.isLoading,
      query: state.routing.locationBeforeTransitions.query,
    };
  }

  getMapDispatchToProps() {
    return {
      loadUserList: actions.adminSettings.userList.query,
      openModal: () => ModalUtils.actions.toggle(modal.addUser, true),
    };
  }

  getFetchers({ params, state, dispatch }){
    const query = get(state, 'routing.locationBeforeTransitions.query', {}, 'Object');
    return {
      promise: actions.adminSettings.userList.query.bind(null, { query }),
    };
  }
}

export default UserListBuilder;
