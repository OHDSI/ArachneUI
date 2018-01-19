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
 * Created: January 18, 2018
 *
 */

import { get } from 'services/Utils';
import actions from 'actions';
import { ContainerBuilder } from 'services/Utils';
import { Component } from 'react';
import Presenter from './presenter';
// import SelectorsBuiler from './selectors';

// const selectors = (new SelectorsBuilder()).build();

const presenter = new Presenter();

class Dasboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gridWidth: null,
    };
    this.setGridWidth = this.setGridWidth.bind(this);
  }

  setGridWidth(gridWidth) {
    this.setState({
      gridWidth,
    });
  }

  render() {
    return presenter.render({
      ...this.props,
      ...this.state,
      setGridWidth: this.setGridWidth,
    });
  }
}

export default class DasboardBuilder extends ContainerBuilder {
  getComponent() {
    return Dasboard;
  }

  mapStateToProps(state) {
    return {};
  }

  getMapDispatchToProps() {
    return {};
  };

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
    };
  }

  getFetchers({ params, state, dispatch }) {
     return {};
  }
}
