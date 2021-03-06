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
 * Created: August 30, 2017
 *
 */

import keyMirror from 'keymirror';

const viewModes = keyMirror({
  CARDS: null,
  TABLE: null,
});

const viewModesOptions = [
  {
    value: viewModes.TABLE,
    ico: 'view_list',
    tooltip: 'Table view',
    tooltipConf: 'bottom',
  },
  {
    value: viewModes.CARDS,
    ico: 'view_module',
    tooltip: 'Tile view',
    tooltipConf: 'bottom',
  },
];

const viewModePageSize = {
  DEFAULT: 10,
  CARDS: 8,
  TABLE: 12,
};

export default viewModes;
export {
  viewModes,
  viewModesOptions,
  viewModePageSize,
};
