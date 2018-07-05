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
 * Authors: Alexander Saltykov
 * Created: January 22, 2018
 *
 */

import { get } from 'services/Utils';
import { connect } from 'react-redux';
import { Component } from 'react';
import presenter from './presenter';

class PasswordField extends Component {
  constructor(props) {
    super(props);
    this.instance = null;
    this.setIsCollapsed = this.setIsCollapsed.bind(this);
    this.setInstance = this.setInstance.bind(this);
  }

  setIsCollapsed(isCollapsed) {
    isCollapsed
      ? this.instance.hide()
      : this.instance.show();
  }

  setInstance(element) {
    this.instance = element;
  }

  render() {
    return presenter({
      ...this.props,
      setIsCollapsed: this.setIsCollapsed,
      setInstance: this.setInstance,
    });
  }
}

function mapStateToProps(state) {
  const rules = get(state, 'auth.passwordPolicy.data.rules', [], 'Array');

  return {
    rules,
  };
}


export default connect(mapStateToProps)(PasswordField);
