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
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import { paths as studyPaths } from 'modules/StudyManager/const';
import { paths as analysisPaths } from 'modules/AnalysisExecution/const';
import { paths as userPaths } from 'modules/ExpertFinder/const';
import { paths as insightsPaths } from 'modules/InsightsLibrary/const';
import { paths as dataCatalogPaths } from 'modules/DataCatalog/const';

import { searchSections, domains } from 'modules/Portal/const';

export default class SelectorsBuilder {
  generateResults(count) {
    const res = [];
    for (let i=0; i<count; i++) {
      const index = Math.ceil((Math.random() * 10) / 3) - 1;
      const r = {
        id: i,
        title: `Result # ${i}`,
        description: '...Some random description indicating the surrounding of the text where the desired string appeared. The string could probably be highlighted to emphasize it..',
        domain: searchSections[0].options[index],
        breadcrumbs: null,
      };
      if ([domains.STUDY_NOTEBOOK].includes(r.domain.value)) {
        r.title = 'Analysis';
        r.breadcrumbs = [{
          title: 'Study',
          id: i,
          domain: {
            label: 'Study',
            value: domains.STUDY_NOTEBOOK,
          },
        },
        {
          title: 'Analysis',
          id: i,
          domain: {
            label: 'Analysis',
            value: domains.ANALYSIS,
          },
        },
        {
          title: 'Submission',
          id: i,
          domain: {
            label: 'Submission',
            value: domains.SUBMISSION,
          },
        }];
      }
      if ([domains.INSIGHTS_LIBRARY].includes(r.domain.value)) {
        r.title = 'Insight';
        r.breadcrumbs = [{
          title: 'Study',
          id: i,
          domain: {
            label: 'Study',
            value: domains.STUDY_NOTEBOOK,
          },
        },
        {
          title: 'Analysis',
          id: i,
          domain: {
            label: 'Analysis',
            value: domains.ANALYSIS,
          },
        }];
      }
      res.push(r);
    }

    return res;
  }

  getRawResults(state) {
    return get(state, 'portal.searchResults.data.result.content', this.generateResults(10), 'Array');
  }

  getPath({ id, domain }) {
    switch (domain.value) {
      case domains.STUDY_NOTEBOOK:
        return studyPaths.studies(id);
      case domains.EXPERT_FINDER:
        return userPaths.profile(id);
      case domains.DATA_CATALOG:
        return dataCatalogPaths.dataCatalog(id);
      case domains.INSIGHTS_LIBRARY:
        return insightsPaths.insights({ insightId: id });
      case domains.ANALYSIS:
        return analysisPaths.analyses(id);
      case domains.FILE:
        return '';
    }
  }

  buildSelectorForGetResults() {
    return createSelector(
      this.getRawResults.bind(this),
      results => results.map((result) => {
        const res = cloneDeep(result);
        res.path = this.getPath(res);
        if (res.breadcrumbs) {
          res.breadcrumbs = res.breadcrumbs.map(crumb => ({
            ...crumb,
            path: this.getPath(crumb),
          }));
        }

        return res;
      })
    );
  }

  build() {
    return {
      getResults: this.buildSelectorForGetResults(),
    };
  }
}
