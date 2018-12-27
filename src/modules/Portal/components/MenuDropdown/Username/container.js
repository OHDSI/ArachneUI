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
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka
 * Created: May 9, 2018
 *
 */

import { Component, PropTypes } from 'react';
import ducks from 'modules/Portal/ducks';
import { get, ContainerBuilder } from 'services/Utils';
import presenter from './presenter';

class Username extends Component {
  componentDidMount() {
    this.props.loadMyProfile();
  }

  render() {
    return presenter(this.props);
  }
}

Username.propTypes = {
  loadMyProfile: PropTypes.func,
};

export default class UsernameBuilder extends ContainerBuilder {
  getComponent() {
    return Username;
  }

  mapStateToProps(state) {
    const data = get(state, 'auth.principal.queryResult.result', {});
    return {
      name: `${data.firstname} ${data.middlename ? (data.middlename.substring(0, 1) + '. ') : ''} ${data.lastname}`,
    };
  }

  getMapDispatchToProps() {
    return {
      loadMyProfile: ducks.actions.myProfile.find,
    };
  }

}
