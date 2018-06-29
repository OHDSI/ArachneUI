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
 * Created: December 20, 2017
 *
 */

import { Component } from 'react';
import presenter from './presenter';

export default class FileBrowser extends Component {

  constructor(props) {
    super(props);

    this.state = {
      container: null,
    };

    this.setContainer = this.setContainer.bind(this);
  }

  componentWillUnmount() {
    this.state.container && this.state.container.removeEventListener('mousewheel', this.onScroll);
  }

  setContainer(element) {
    this.setState({
      container: element,
    });
    element.addEventListener('mousewheel', this.onScroll);
  }

  onScroll(event) {
    event.stopImmediatePropagation();
  }

  render() {
    return presenter({
      ...this.props,
      ...this.state,
      setContainer: this.setContainer,
    });
  }
}
