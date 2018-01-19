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
 * Created: January 19, 2018
 *
 */

import { LAYOUT_LS_KEY } from 'modules/Dashboard/const';

class Position {
  constructor(i, w = 1, h = 1, x = 0, y = 0, isStatic = false, minW, maxW) {
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
    this.i = i;
    this.static = isStatic;
    this.minW = minW;
    this.maxW = maxW;
  }
}

export class LayoutManager {
  static updateLayout(layout) {
    localStorage.setItem(LAYOUT_LS_KEY, JSON.stringify(layout));
  }
  static getSavedLayout() {
    return JSON.parse(localStorage.getItem(LAYOUT_LS_KEY) || '{}');
  }

  static get Position() {
    return Position;
  }
}
