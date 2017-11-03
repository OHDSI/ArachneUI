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
 * Created: July 19, 2017
 *
 */

// @ts-check
import { Utils, get } from 'services/Utils';
import actions from 'actions';
import { paths } from 'modules/InsightsLibrary/const';
import viewModes from 'const/viewModes';
import { push as goToPage } from 'react-router-redux';
import URI from 'urijs';
import InsightsLibraryListActions from './presenter';

/** @augments { Component<any, any> } */
export default class InsightsLibraryListActionsBuilder {
  getComponent() {
    return InsightsLibraryListActions;
  }

  mapStateToProps(state) {
    const queryParams = get(state, 'routing.locationBeforeTransitions.query', {}, 'Object');

    return {
      queryParams,
      isCardsView: queryParams.view === viewModes.CARDS,
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      loadInsights: actions.insightsLibrary.insights.query,
      redirect: (queryParams) => {
        const url = new URI(paths.insights());
        url.setSearch(queryParams);
        return goToPage(url.href());
      },
      reload: actions.router.reload
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      setViewMode(viewMode) {
        dispatchProps.redirect({
          ...stateProps.queryParams,
          view: viewMode,
        });
      },
    };
  }

  build() {
    return Utils.buildConnectedComponent({
      Component: this.getComponent(),
      mapStateToProps: this.mapStateToProps,
      mapDispatchToProps: this.getMapDispatchToProps(),
      mergeProps: this.mergeProps,
    });
  }
}

