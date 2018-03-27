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
 * Created: September 06, 2017
 *
 */

import {
  Utils,
  get,
} from 'services/Utils';
import { dsConverter as basicDsConverter } from 'components/LabelDataSource';

function dsInfoConvert(dataSource, attrList) {
  const attributes = {};

  attrList.forEach((attribute) => {
    const value = get(dataSource, attribute.name);
    if (value) {
      attributes[attribute.name] = Utils.castValue(value, attribute);
    }
  });

  const data = {
    ...attributes,
    ...basicDsConverter(dataSource),
  };
  return data;
}

export default dsInfoConvert;
