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

import { get } from 'services/Utils';
import actions from 'actions';
import presenter from './presenter';
//import SelectorsBuiler from './selectors';
import { ContainerBuilder } from 'services/Utils';
import { Component } from 'react';
import { searchSections as sections } from 'modules/Portal/const';

import { paths as studyPaths } from 'modules/StudyManager/const';

//const selectors = (new SelectorsBuilder()).build();

class SearchResults extends Component {
  constructor(props) {
    super(props);
    const sct = sections.map((section) => ({
      ...section,
      resultsCount: Math.ceil(Math.random() * 10),
      isActive: true,
    }));
    this.state = {
      sections: sct,
      results: sct.map((section) => ({
        ...section,
        results: this.generateResults(section.resultsCount),
      })),
    };
    this.toggleSection = this.toggleSection.bind(this);
  }

  generateResults(count) {
    const res = [];
    for (let i=0; i<count; i++) {
      res.push({
        title: `Result # ${i}`,
        description: 'Some random description',
        path: studyPaths.studies(27),
      });
    }

    return res;
  }

  toggleSection(section) {
    this.setState({
      sections: this.state.sections.map((stateSection) => ({
        ...stateSection,
        isActive: stateSection.code === section.code
          ? !stateSection.isActive
          : stateSection.isActive,
      })),
      results: this.state.results.map((res) => ({
        ...res,
        isActive: res.code === section.code
          ? !res.isActive
          : res.isActive,
      })),
    });
  }

  render() {
    return presenter({
      ...this.props,
      ...this.state,
      toggleSection: this.toggleSection,
    });
  }
}

export default class SearchResultsBuilder extends ContainerBuilder {
  getComponent() {
    return SearchResults;
  }


  mapStateToProps(state) {
    // TODO: sanitize query
    
    return {
      query: get(state, 'routing.locationBeforeTransitions.query.query', ''),      
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
    };
  }

  getFetchers({ params, state, dispatch }) {
     return {};
  }
}