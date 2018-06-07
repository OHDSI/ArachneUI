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
 * Created: September 11, 2017
 *
 */

// @ts-check
import { publishStates } from 'modules/InsightsLibrary/const';
import types from 'const/modelAttributes';

/**
  * @returns { Array<{ label: string; name: string; type: string; forceOpened: boolean; hasTitle: boolean; placeholder?: string; options?: Array<{ label: string; value: string; }>; }> }
  */
function getFields() {
  return [
    {
      label: 'My favorites',
      name: 'favourite',
      type: types.toggle,
      forceOpened: true,
      hasTitle: false,
    },
    {
      label: 'Publish state',
      name: 'publishState',
      isMulti: false,
      type: types.enum,
      forceOpened: true,
      hasTitle: true,
      placeholder: 'Any',
      options: publishStates,
    },
  ];
}

export default getFields;