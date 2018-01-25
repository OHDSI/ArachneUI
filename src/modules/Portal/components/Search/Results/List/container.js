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
 * Created: january 23, 2018
 *
 */

import { get } from 'services/Utils';
import actions from 'actions';
import SearchResultsList from './presenter';
//import SelectorsBuiler from './selectors';
import { ContainerBuilder } from 'services/Utils';


import { paths as studyPaths } from 'modules/StudyManager/const';
import { searchSections } from 'modules/Portal/const';

//const selectors = (new SelectorsBuilder()).build();

export default class SearchResultsListBuilder extends ContainerBuilder {
  getComponent() {
    return SearchResultsList;
  }

  generateResults(count) {
    const res = [];
    for (let i=0; i<count; i++) {
      const index = Math.ceil((Math.random() * 10) / 3) - 1;
      res.push({
        title: `Result # ${i}`,
        description: '...Some random description indicating the surrounding of the text where the desired string appeared. The string could probably be highlighted to emphasize it..',
        path: studyPaths.studies(27),
        domain: searchSections[0].options[index],
      });
    }

    return res;
  }

  mapStateToProps(state) {
    
    return {
      results: this.generateResults(10),
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
}