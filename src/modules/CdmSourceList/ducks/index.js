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
 * Created: November 24, 2017
 *
 */

import characterization from './characterization';
import dataSource from './dataSource';
import dataSourceList from './dataSourceList';
import dataSourceBusiness from './dataSourceBusiness';
import dbmsTypes from './dbmsTypes';
import achillesResults from './achillesResults';

export default {
  actions: {
    characterization: characterization.actions,
    dataSource: dataSource.actions,
    dataSourceList: dataSourceList.actions,
    dataSourceBusiness: dataSourceBusiness.actions,
    dbmsTypes: dbmsTypes.actions,
    achillesResults: achillesResults.actions,

  },
  reducer: {
    characterization: characterization.reducer,
    dataSource: dataSource.reducer,
    dataSourceList: dataSourceList.reducer,
    dataSourceBusiness: dataSourceBusiness.reducer,
    dbmsTypes: dbmsTypes.reducer,
    achillesResults: achillesResults.reducer,
  },
};
