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
 * Created: September 21, 2017
 *
 */

import 'es6-promise/auto';
import 'core-js/fn/object/values';
import 'core-js/fn/object/assign';
import 'core-js/fn/array/includes';
import 'core-js/fn/array/find';

// Fetch polyfill

if (typeof navigator !== 'undefined' && typeof navigator.userAgent === 'string') {
  // Microsoft are idiots as usual and fetch from their Edge v40 is not working,
  // so we need to force polyfill in such case
  const isEdge = /Edge\//.test(navigator.userAgent);
  if (isEdge) {
    window.fetch = undefined; // ensure the polyfill runs
  }
}

require('whatwg-fetch');
