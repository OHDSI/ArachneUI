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
import {
  publishStateOptions,
  paths,
} from 'modules/InsightsLibrary/const';
import { paths as studyPaths } from 'modules/StudyManager/const';
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
      backUrl: paths.insights(),
      breadcrumbList: [
        {
          label: 'Insights Library',
          link: paths.insights(),
        },
        {
          label: 'Study',
          link: studyPaths.studies(get(state, 'insightsLibrary.insights.data.study.id', 0)),
        },
      ],
      insightId: get(state, 'insightsLibrary.insights.data.id', -1),
      name: get(state, 'insightsLibrary.insights.data.study.title', 'Insight'),
      permissions: get(state, 'insightsLibrary.insights.data.permissions', {}, 'Object'),
      selectedPublishState,
    };
  }

  build() {
    return Utils.buildConnectedComponent({
      Component: this.getComponent(),
      mapStateToProps: this.mapStateToProps,
    });
  }
}
