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
 * Created: October 06, 2017
 *
 */

import dataSourceList from './dataSourceList';
import dataSourceMetadataAttrs from './dataSourceMetadataAttrs';
import dataSource from './dataSource';
import studyList from './studyList';
import report from './report';
import reportDetails from './reportDetails';
import characterization from './characterization';
import myDatasources from './myDatasources';

export default {
  actions: {
    dataSourceList: dataSourceList.actions,
    dataSourceMetadataAttrs: dataSourceMetadataAttrs.actions,
    dataSource: dataSource.actions,
    studyList: studyList.actions,
    report: report.actions,
    reportDetails: reportDetails.actions,
    characterization: characterization.actions,
    myDatasources: myDatasources.actions,
  },
  reducer: {
    dataSourceList: dataSourceList.reducer,
    dataSourceMetadataAttrs: dataSourceMetadataAttrs.reducer,
    dataSource: dataSource.reducer,
    studyList: studyList.reducer,
    report: report.reducer,
    reportDetails: reportDetails.reducer,
    characterization: characterization.reducer,
    myDatasources: myDatasources.reducer,
  },
};
