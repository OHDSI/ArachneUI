/**
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
import { Component, PropTypes } from 'react';
import { Utils, get } from 'services/Utils';
import actions from 'actions';
import presenter from './presenter';
import SelectorsBuilder from './selectors';

const selectors = (new SelectorsBuilder()).build();

/** @augments { Component<any, any> } */
class ViewEditInsight extends Component {
  render() {
    return presenter(this.props);
  }
}

export default class ViewEditInsightBuilder {
  getComponent() {
    return ViewEditInsight;
  }

  mapStateToProps(state, ownProps) {
    return {
      insightId: ownProps.params.insightId,
      insight: selectors.getInsight(state),
      isLoading: get(state, 'insightsLibrary.insights.isLoading', false),
      permissions: get(state, 'insightsLibrary.insights.data.permissions', {}, 'Object'),
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      loadInsight: actions.insightsLibrary.insights.find,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      loadInsight: () => {
        dispatchProps.loadInsight({ insightId: stateProps.insightId });
      },
    };
  }

  getFetchers({ params }) {
    const load = actions.insightsLibrary.insights.find;
    return {
      load: () => load({ insightId: params.insightId }),
    };
  }

  build() {
    return Utils.buildConnectedComponent({
      Component: this.getComponent(),
      mapStateToProps: this.mapStateToProps,
      mapDispatchToProps: this.getMapDispatchToProps(),
      mergeProps: this.mergeProps,
      getFetchers: this.getFetchers,
    });
  }
}
