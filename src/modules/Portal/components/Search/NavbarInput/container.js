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
 * Created: january 22, 2018
 *
 */

import { Component } from 'react';
import ducks from 'modules/Portal/ducks';
import { ContainerBuilder, get } from 'services/Utils';
import { form, paths } from 'modules/Portal/const';
import { push as goToPage } from 'react-router-redux';
import presenter from './presenter';
import SelectorsBuilder from '../Results/List/selectors';

const selectors = (new SelectorsBuilder()).build();

class NavbarSearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: true,
    };
    this.input = null;
    this.setIsCollapsed = this.setIsCollapsed.bind(this);
    this.setInput = this.setInput.bind(this);
  }

  setIsCollapsed(isCollapsed = false) {
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

  render() {
    const query = get(this.input, 'input.props.value', '');

    return presenter({
      ...this.props,
      ...this.state,
      results: [
        ...this.props.results,
        {
          label: `All results (${this.props.totalResults})`,
          value: paths.search({ query }),
        },
      ],
      setIsCollapsed: this.setIsCollapsed,
      setInput: this.setInput,
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
    const results = selectors.getBriefResults(state);
    const totalResults = get(state, 'portal.search.queryResult.totalElements', 0);

    return {
      results,
      totalResults,
    };
  }

  getMapDispatchToProps() {
    return {
      showResults: goToPage,
      fetchResults: ducks.actions.search.query,
    };
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
