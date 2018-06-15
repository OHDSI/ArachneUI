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
 * Created: September 11, 2017
 *
 */

import React from 'react';
import StudyStatus from 'modules/StudyManager/components/Status';
import types from 'const/modelAttributes';

export default function getFields(props) {
  return [
    {
      label: 'My studies',
      name: 'my',
      type: types.toggle,
      forceOpened: true,
      hasTitle: false,
    },
    {
      label: 'My favorites',
      name: 'favourite',
      type: types.toggle,
      forceOpened: true,
      hasTitle: false,
    },
    {
      label: 'Type',
      name: 'type',
      type: types.enum,
      isMulti: true,
      forceOpened: true,
      hasTitle: true,
      options: props.typeOptions,
    },
    {
      label: 'Status',
      name: 'status',
      type: types.enum,
      isMulti: true,
      forceOpened: true,
      hasTitle: true,
      options: props.statusOptions.map(opts => ({
        label: <StudyStatus {...opts} />,
        value: opts.value,
      })),
    },
    {
      label: 'Privacy',
      name: 'privacy',
      type: types.enum,
      forceOpened: true,
      hasTitle: true,
      isMulti: false,
      options: [
        {
          label: 'Private',
          value: 'true',
        },
        {
          label: 'Public',
          value: 'false',
        },
      ],
    },
  ];
}
