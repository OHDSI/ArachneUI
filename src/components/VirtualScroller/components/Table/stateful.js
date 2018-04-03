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
  * Created: Tuesday, March 20, 2018 5:15 PM
  *
  */

import { Component, PropTypes } from 'react';
import presenter from './presenter';

export default class VirtualTable extends Component {
  static get propTypes() {
    return {
      list: PropTypes.bool,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      container: null,
    };
    this.defaultContainerHeight = 500;
    this.defaultContainerWidth = 200;
    this.setContainer = this.setContainer.bind(this);
  }

  setContainer(container) {
    if (container && !this.state.container) {
      this.setState({
        container,
      });
    }
  }

  render() {
    let height = this.defaultContainerHeight;
    let width = null;
    const columnWidth = this.defaultContainerWidth;
    if (this.state.container) {
      const rect = this.state.container.getBoundingClientRect();
      if (rect.height !== 0) {
        height = rect.height;
      }
      if (this.props.list) {
        height += 47;
        width = rect.width;
      }
    }
    return presenter({
      ...this.props,
      ...this.state,
      setContainer: this.setContainer,
      containerHeight: height,
      containerWidth: width,
      columnWidth,
    });
  }
}
