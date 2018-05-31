/*
 *
 * Copyright 2018 Observational Health Data Sciences and Informatics
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
import ducks from 'modules/Portal/ducks';
import { get, ContainerBuilder } from 'services/Utils';
import presenter from './presenter';
import selectors from './selectors';


export default class MenuDropdownBuilder extends ContainerBuilder {
  getComponent() {
    return presenter;
  }

  mapStateToProps(state) {
    const data = get(state, 'portal.myProfile.data.result', {});
    const hash = get(state, 'expertFinder.userProfile.data.result.updated', '');

    return {
      id: data.id,
      hash,
      tenants: selectors.getTenants(state),
      newActiveTenantId: selectors.getNewActiveTenantId(state),
    };
  }

  getMapDispatchToProps() {
    return {
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
        window.location.reload(true);
      },
    };
  }
}
