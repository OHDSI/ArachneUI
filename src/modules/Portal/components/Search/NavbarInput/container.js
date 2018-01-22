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
 * Created: january 22, 2018
 *
 */

import { Component } from 'react';
import actions from 'actions';
import { ContainerBuilder, get } from 'services/Utils';
import { form, paths } from 'modules/Portal/const';
import { paths as studyPaths } from 'modules/StudyManager/const';
import presenter from './presenter';

class NavbarSearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: true,
      results: [],
    };
    this.input = null;
    this.toggle = this.toggle.bind(this);
    this.setInput = this.setInput.bind(this);
    this.fetchResults = this.fetchResults.bind(this);
  }

  toggle(isCollapsed = false) {
    this.setState({
      isCollapsed,
    });
    if (!isCollapsed && this.input) {
      this.input.focus();
    }
  }

  setInput(element) {
    this.input = element;
  }

  fetchResults(query) {
    const results = [];
    if (query) {
      for (let i=0; i<Math.ceil(Math.random() * 10); i++) {
        results.push({
          value: `${i}`,
          label: `Result #${i}`,
          caption: 'Some random caption',
          path: studyPaths.studies(27),
        });
      }
      results.push({
        label: 'All results (105)',
        value: 'all',
        path: paths.search({ query }),
      });
    }

    this.setState({
      results,
    });
  }

  render() {
    return presenter({
      ...this.props,
      ...this.state,
      toggle: this.toggle,
      setInput: this.setInput,
      fetchResults: this.fetchResults,
    });
  }
}

export default class NavbarSearchInputBuilder extends ContainerBuilder {
  getComponent() {
    return NavbarSearchInput;
  }

  getFormParams() {
    return {
      form: form.search,
    };
  }

  mapStateToProps(state) {
    return {
    };
  }

  getMapDispatchToProps() {
    return {};
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      onSubmit() {

      },
    };
  }

}
