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
 * Created: June 13, 2017
 *
 */

import { paths } from 'modules/AnalysisExecution/const';

function buildBreadcrumbList(breadcrumbs = []) {
  const breadcrumbList = [];

  breadcrumbs.forEach((crumb) => {
    switch (crumb.entityType) {
      case 'STUDY':
        breadcrumbList.push({
          label: 'My studies',
          link: paths.studies(),
        });
        breadcrumbList.push({
          label: crumb.title,
          link: paths.studies(crumb.id),
        });
        break;
      case 'ANALYSIS':
        breadcrumbList.push({
          label: crumb.title,
          link: paths.analyses(crumb.id),
        });
        break;
      case 'INSIGHT':
        breadcrumbList.push({
          label: crumb.title,
          link: paths.insight({ submissionId: crumb.id }),
        });
        break;
      default: break;
    }
  });

  return breadcrumbList;
}

export default {
  buildBreadcrumbList,
};
export {
  buildBreadcrumbList,
};
