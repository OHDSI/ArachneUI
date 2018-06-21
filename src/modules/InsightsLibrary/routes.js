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
 * Created: July 17, 2017
 *
 */

import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import List from './components/List';
import ViewEdit from './components/ViewEdit';
import FileViewer from './components/FileViewer';

import { Utils } from 'services/Utils';
import { paths } from './const';
import { getSavedFilter } from './ducks/insights';

function Routes() {
  return [
    <Route
      path="insights"
      component={List}
      onEnter={
        Utils.getSavedFiltersRestorer({
          getSavedFilter,
          basePath: paths.insights(),
        })
      }
    />,
    <Route path="insights/:insightId" component={ViewEdit} />,
    <Route path="insights/:insightId/files/:fileUuid" component={FileViewer} />,
    <IndexRedirect to="insights" />,
  ];
}

export default Routes;
