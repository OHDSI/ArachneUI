/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
 * Created: December 27, 2016
 *
 */

import React from 'react';
import { Route } from 'react-router';

import ListStudies from './components/List';
import ViewEditStudy from './components/ViewEdit';
import DocumentViewer from './components/DocumentViewer';

import { Utils } from 'services/Utils';
import { paths } from './const';
import studyListDuck from './ducks/studyList';

function Routes() {
  return [
    <Route
      path="studies"
      component={ListStudies}
      onEnter={
        Utils.getSavedFiltersRestorer({
          getSavedFilter: studyListDuck.actions.getSavedFilter,
          basePath: paths.studies(),
        })
      }
    />,
    <Route path="studies/:studyId" component={ViewEditStudy} />,
    <Route path="studies/:studyId/documents/:fileUuid" component={DocumentViewer} />,
  ];
}

export default Routes;
