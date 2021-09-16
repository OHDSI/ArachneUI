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
 * Created: December 20, 2017
 *
 */

import React from 'react';
import presenter from './presenter';

export default class SummaryIncidenceContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ratio: 1000,
    };
  }
  
  changeRatio = (multiplier) => {
    let ratio = this.state.ratio * multiplier;
    ratio = Math.min(ratio, 100000);
    ratio = Math.max(ratio, 100);
    this.setState({ratio: ratio})
  }
  
  render() {
    const { ratio } = this.state;
    return presenter({
      ...this.props,
      ratio,
      changeRatio: this.changeRatio,
    });
  }
}
