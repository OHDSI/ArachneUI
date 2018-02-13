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
 * Created: January 24, 2017
 *
 */

import { Component, PropTypes } from 'react';
import ducks from 'modules/ExpertFinder/ducks';
import { get, ContainerBuilder } from 'services/Utils';
import presenter from './presenter';
import selectors from './selectors';

class MenuDropdown extends Component {
  componentWillMount() {
    this.props.loadMyProfile();
  }

  render() {
    return presenter(this.props);
  }
}

MenuDropdown.propTypes = {
  loadMyProfile: PropTypes.func,
};


export default class MenuDropdownBuilder extends ContainerBuilder {
  getComponent() {
    return MenuDropdown;
  }

  mapStateToProps(state) {
    const moduleState = state.expertFinder.myProfile;
    const id = get(moduleState, 'data.result.id', '');
    let firstName = get(moduleState, 'data.result.firstname', '');
    const lastName = get(moduleState, 'data.result.lastname', '');
    let middleName = get(moduleState, 'data.result.middlename', '');
    if (!firstName && !middleName && !lastName) {
      firstName = 'NAME';
    }
    if (middleName) {
      middleName = `${middleName.substring(0, 1)}.`;
    }
    const hash = get(state, 'expertFinder.userProfile.data.result.updated', '');

    return {
      id,
      firstName,
      lastName,
      middleName,
      hash,
      tenants: selectors.getTenants(state),
      newActiveTenantId: selectors.getNewActiveTenantId(state),
    };
  }

  getMapDispatchToProps() {
    return {
      loadMyProfile: ducks.actions.myProfile.find,
      updateUser: ducks.actions.userSettings.update,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      async setActiveTenant({ activeTenantId }) {
        await dispatchProps.updateUser({}, { activeTenantId });
        await dispatchProps.loadMyProfile;
        window.location.reload(true);
      },
    };
  }
}
