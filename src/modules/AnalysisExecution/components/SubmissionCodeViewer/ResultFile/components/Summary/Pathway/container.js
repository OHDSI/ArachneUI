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
 * Created: Apr 24, 2019
 *
 */

import { ContainerBuilder, get } from 'services/Utils';
import SummaryPathway from './presenter';
import { sunburst } from '@ohdsi/atlascharts/dist/atlascharts.umd';
import PathwaySummarySelectorsBuilder from './selectors';
import actions from 'actions';

const selectors = (new PathwaySummarySelectorsBuilder()).build();

export default class SummayPathwayBuilder extends ContainerBuilder {

  getComponent() {
    return SummaryPathway;
  }

  mapStateToProps(state, ownProps)
  {
    const details = get(state, 'analysisExecution.pathwaySummary.details', [], 'Array');

    return {
      pathways: selectors.getPathways(state),
      sunburstChart: new sunburst(),
      details,
    };
  }

  getMapDispatchToProps() 
  {
    return {
      loadPathwayDetails: actions.analysisExecution.pathwaySummary.getDetails,
    };
  }

};