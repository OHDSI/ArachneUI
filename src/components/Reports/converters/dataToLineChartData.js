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
 * Authors: Alexander Saltykov
 * Created: November 13, 2017
 *
 */

import { get } from 'services/Utils';

export default (data, DTO = { name: 'All series', xValue: 'x', yValue: 'y', yPercent: 'p' }) => {
  return [{
    name: DTO.name || '',
    values: get(data, DTO.xValue, []).map((val, i) => ({
      xValue: data[DTO.xValue][i],
      yValue: data[DTO.yValue][i],
    })),
  }];
};
