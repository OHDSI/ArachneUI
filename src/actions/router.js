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
 * Created: December 13, 2016
 *
 */

import { push as goToPage } from 'react-router-redux';
import URI from 'urijs';
import omit from 'lodash/omit';

function setSearch(query) {
  return (dispatch, getState) => {
    // Get current route
    const route = getState().routing.locationBeforeTransitions;
    // Use URI utility for manipulating url
    const uri = new URI(route.pathname + route.search);
    // Detect what needs to be removed (was cleared)
    const removeSearch = Object.keys(query).filter(key => query[key] === null);

    // Set new params
    uri.setSearch({ ...(omit(query, removeSearch)) });

    // Go to new url
    const path = uri.toString();
    dispatch(goToPage(path));
  };
}

function reload() {
  return setSearch({ hash: Math.random().toString(36).substring(7) });
}

export default {
  goToPage,
  reload,
  setSearch,
};
