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
 * Created: January 29, 2018
 *
 */

// @ts-check
import { createSelector } from 'reselect';
import { get } from 'services/Utils';
import cloneDeep from 'lodash/cloneDeep';
import { paths as studyPaths } from 'modules/StudyManager/const';
import { paths as analysisPaths } from 'modules/AnalysisExecution/const';
import { paths as userPaths } from 'modules/ExpertFinder/const';
import { paths as insightsPaths } from 'modules/InsightsLibrary/const';
import { paths as dataCatalogPaths } from 'modules/DataCatalog/const';

import { domains, domainNames } from 'modules/Portal/const';

export default class SelectorsBuilder {

  getRawResults(state) {
    return get(state, 'portal.search.queryResult.content', [], 'Array');
  }

  getPath({ id, entityType }) {
    switch (entityType) {
      case domains.STUDY:
        return studyPaths.studies(id);
      case domains.USER:
        return userPaths.profile(id);
      case domains.DATA_SOURCE:
        return dataCatalogPaths.dataCatalog(id);
      case domains.PAPER:
        return insightsPaths.insights({ insightId: id });
      case domains.ANALYSIS:
        return analysisPaths.analyses(id);
    }
  }

  addDomain(result) {
    const breadcrumbs = get(result, 'breadcrumbs', [{}], 'Array');
    const domain = breadcrumbs[breadcrumbs.length - 1];
    return {
      ...result,
      title: domain.title,
      domain: {
        ...domain,
        label: domainNames[domain.entityType],
      },
    };
  }

  addPath(result) {
    const res = cloneDeep(result);
    res.path = this.getPath({ id: res.id, entityType: res.domain.entityType });
    if (res.breadcrumbs) {
      res.breadcrumbs = res.breadcrumbs.map(crumb => ({
        ...crumb,
        link: this.getPath(crumb),
        label: crumb.title,
      }));
    }

    return res;
  }

  buildSelectorForGetResults() {
    return createSelector(
      [this.getRawResults],
      results => results
        .map(this.addDomain)
        .map(this.addPath.bind(this))
    );
  }

  buildSelectorForBriefResults(getResults) {
    return createSelector(
      [getResults],
      results => results.map((res) => ({
        label: res.title,
        value: res.path,
      }))
    );
  }

  build() {
    const getResults = this.buildSelectorForGetResults();

    return {
      getResults,
      getBriefResults: this.buildSelectorForBriefResults(getResults),
    };
  }
}
