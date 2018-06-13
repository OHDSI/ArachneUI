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
 * Created: August 02, 2017
 *
 */

// @ts-check
import { Utils, get } from 'services/Utils';
import actions from 'actions';
import { ModalUtils } from 'arachne-ui-components';
import { modals } from 'modules/InsightsLibrary/const';
import { studyActions } from 'modules/StudyManager/const';
import Settings from './presenter';

const ModalSettings = ModalUtils.connect({
  name: modals.settings,
})(Settings);

export default class ModalSettingsBuilder {
  getComponent() {
    return ModalSettings;
  }


  mapStateToProps(state) {

    return {
      publishState: get(state, 'insightsLibrary.insights.data.publishState', 'DRAFT', 'String'),
      insightId: get(state, 'insightsLibrary.insights.data.id'),
      canPublishPaper: get(state, 'insightsLibrary.insights.data.study.status.availableActions', []).includes(studyActions.publishPaper),
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      updateInsight: actions.insightsLibrary.insights.update,
      loadInsight: actions.insightsLibrary.insights.find,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      changePublishState(publishState) {
        if (!stateProps.canPublishPaper) {
          return false;
        }
        dispatchProps
          .updateInsight({ insightId: stateProps.insightId }, { publishState })
          .then(() => dispatchProps.loadInsight({ insightId: stateProps.insightId }))
          .catch(() => {});
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
