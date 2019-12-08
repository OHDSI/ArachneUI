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
 * Authors: Anastasiia Klochkova
 * Created: December 09, 2019
 *
 */

import { Component } from 'react';
import { get, ContainerBuilder } from 'services/Utils';
import ProtectedViewPresenter from './presenter';


class ProtectedView extends Component {

  render() {
    return ProtectedViewPresenter({
      ...this.props,
    });
  }
}

class ProtectedViewBuilder extends ContainerBuilder {
  getComponent() {
    return ProtectedView;
  }

  mapStateToProps(state) {
    return {
      isAdmin: get(state, 'auth.principal.queryResult.result.isAdmin'),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
  };
  }
}
export default ProtectedViewBuilder;
