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
* Created: December 03, 2018
*
*/
import { Guard } from 'community/services/Guard';
import { Component } from 'react';
import presenter from './presenter';

export default class GuardedComponent extends Component {
  constructor(props) {
    super(props);
    this.setState({
      isMet: true,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.check(nextProps);
  }

  check(props) {
    if (props.rules instanceof Guard) {
      this.setState({
        isMet: props.rules.isMet(),
      });
    }
  }

  render() {
    return presenter({
      ...this.props,
      ...this.state,
    });
  }
}
