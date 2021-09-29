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
 * Authors: Sergey Suvorov
 * Created: September 27, 2021
 *
 */

import actions from 'actions/index';
import { Component } from 'react';
import { ContainerBuilder } from 'services/Utils';
import presenter from './presenter';
import selectors from './selectors';

class OperationalDashboard extends Component {
  constructor(props) {
    super(props);
  }

  startPollingEngineStatus() {
    this.props.loadEngineStatus();
    this.poll = setInterval(() => {
      this.props.loadEngineStatus();
    }, 10000);
  }
  
  componentDidMount() {
    this.startPollingEngineStatus();
  }

  componentWillUnmount() {
    if (this.poll) {
      clearInterval(this.poll);
    }
  }

  render() {
    return presenter(this.props);
  }
}

class OperationalDashboardBuilder extends ContainerBuilder {

  getComponent() {
    return OperationalDashboard;
  }

  mapStateToProps(state) {
    return {
      dashboardGroupList: selectors.getOperationalDashboardGroups(state),
    };
  }

  getMapDispatchToProps() {
    return {
      loadEngineStatus: actions.adminSettings.engineStatus.query,
    };
  }
}

export default OperationalDashboardBuilder;
