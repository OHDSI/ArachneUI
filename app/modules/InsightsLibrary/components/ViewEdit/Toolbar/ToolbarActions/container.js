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
 * Created: September 08, 2017
 *
 */

// @ts-check
import { push as goToPage } from 'react-router-redux';
import { Utils, get } from 'services/Utils';
import actions from 'actions';
import {
  publishStateOptions,
  modals,
  paths,
} from 'modules/InsightsLibrary/const';
import { ModalUtils } from 'arachne-components';
import Toolbar from './presenter';

export default class ToolbarBuilder {
  getComponent() {
    return Toolbar;
  }

  mapStateToProps(state) {
    const selectedPublishStateValue = get(state, 'insightsLibrary.insights.data.publishState', 'PUBLISHED', 'String');
    const selectedPublishState = get(
      publishStateOptions.filter(option => option.value === selectedPublishStateValue),
      '[0]',
      {},
      'Object'
    );

    return {
      insightId: get(state, 'insightsLibrary.insights.data.id'),
      permissions: get(state, 'insightsLibrary.insights.data.permissions', {}, 'Object'),
      selectedPublishState,
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      remove: actions.insightsLibrary.insights.delete,
      goToList: () => goToPage(paths.insights()),
      openSettings: () => ModalUtils.actions.toggle(modals.settings, true),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      remove: () => {
        Utils.confirmDelete()
          .then(() => {
            dispatchProps
              .remove({ insightId: stateProps.insightId })
              .then(() => dispatchProps.goToList());
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
