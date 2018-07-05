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
 * Created: July 10, 2017
 *
 */

import { createSelector } from 'reselect';
import { get } from 'services/Utils';

const getStudyData = state => get(
  state,
  'studyManager.study.data',
  {
    description: null,
    startDate: 1,
    endDate: 2,
    files: [],
    participants: [],
    dataSources: [],
    analyses: [],
  },
  'Object'
);

const getStepList = createSelector(
  [getStudyData],
  study => ([
    {
      element: '#study-dates',
      position: 'right',
      title: 'Setup study duration',
      // descr: 'Lorem Ipsum ...',
      isDone: study.startDate !== study.endDate,
    },
    {
      element: '#study-objective',
      position: 'right',
      title: 'Define objective',
      isDone: !!study.description,
    },
    {
      element: '#study-docs',
      position: 'right',
      title: 'Attach protocol and related documents',
      isDone: get(study, 'files.length', 0) > 0,
    },
    {
      element: '#study-participants',
      position: 'right',
      title: 'Invite contributors',
      isDone: get(study, 'participants.length', 0) > 0,
    },
    {
      element: '#study-data-sources',
      position: 'right',
      title: 'Select data sources',
      isDone: get(study, 'dataSources.length', 0) > 0,
    },
    {
      element: '#study-analyses',
      position: 'left',
      title: 'Create and execute analyses',
      isDone: get(study, 'analyses.length', 0) > 0,
    },
    {
      title: 'Publish a paper',
      isDone: study.paperId !== null,
    },
  ])
);

export default {
  getStepList,
};
