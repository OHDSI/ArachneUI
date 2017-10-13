/**
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
 * Created: September 05, 2017
 *
 */

import Duck from 'services/Duck';
import api from 'services/Api';
import { apiPaths } from 'modules/StudyManager/const';
import Uri from 'urijs';

const actionCoreName = 'SM_STUDY';

const ducks = new Duck({
  name: actionCoreName,
  urlBuilder: (params) => {
    const url = new Uri(apiPaths.studies());
    url.setSearch(params);
    return url.href();
  },
});

const actions = ducks.actions;
const reducer = ducks.reducer;


function setFavourite(studyId, isFavourite) {
  return () => api.doPut(
    apiPaths.setFavourite(studyId),
    {
      value: isFavourite,
    },
  );
}

function saveFilter(values) {
  localStorage.setItem('study-list-filter', JSON.stringify(values));
}

function getSavedFilter() {
  return JSON.parse(localStorage.getItem('study-list-filter'));
}

function dropFilter() {
  localStorage.removeItem('study-list-filter');
}

export default {
  actions: {
    ...actions,
    setFavourite,
    saveFilter,
    getSavedFilter,
    dropFilter,
  },
  reducer,
};
