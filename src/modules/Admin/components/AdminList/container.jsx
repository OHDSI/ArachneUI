/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
import { ModalUtils } from 'arachne-ui-components';
import { modal } from 'modules/Admin/const';
import { nodeFunctionalModes } from 'modules/Auth/const';
import { ContainerBuilder, get } from 'services/Utils';
import actions from 'actions';
import presenter from './presenter';

class AdminList extends Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.query !== this.props.query) {
      this.props.loadAdminList({ query: nextProps.query });
    }
  }

  render() {
    return presenter(this.props);
  }
}

class AdminListBuilder extends ContainerBuilder {

  getComponent() {
    return AdminList;
  }

  mapStateToProps(state) {
    const isStandalone = get(state, 'auth.nodeMode.data.mode') === nodeFunctionalModes.Standalone;
    const isAdmin = get(state, 'auth.principal.queryResult.result.isAdmin');
    return {
      isLoading: state.adminSettings.adminList.isLoading,
      query: state.routing.locationBeforeTransitions.query,
      isAdmin,
      isStandalone,
    };
  }

  getMapDispatchToProps() {
    return {
      loadAdminList: actions.adminSettings.adminList.query,
      openModal: () => ModalUtils.actions.toggle(modal.addAdminUser, true),
    };
  }

  getFetchers({ params, state, dispatch }) {
    const query = get(state, 'routing.locationBeforeTransitions.query', {}, 'Object');
    return {
      loadAdminList: actions.adminSettings.adminList.query.bind(null, { query }),
    }
  }

  static propTypes = {
    loadAdminList: PropTypes.func,
  };
}

export default AdminListBuilder;
