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
 * Created: September 08, 2017
 *
 */

import { createSelector } from 'reselect';
import { get } from 'services/Utils';
import { staticAttrList } from 'const/dataSource';
import { modelTypesValues } from '../../../../../const/dataSource';

class CdmSourceListViewEditSelectorsBuilder {

  getAttrList(state) {
    return staticAttrList.filter(el => !el.calculated);
  }

  getValues(state) {
    return get(state, 'form.editSourceBusinessData.values', {}, 'Object');
  }

  getAttributes(attrList, values) {
    return (values.modelType === modelTypesValues.CDM) ? attrList : attrList.filter(el => !el.cdmSpecific);
  }

  buildSelectorForGetAttrList() {
    return createSelector(
      [this.getAttrList.bind(this), this.getValues],
      this.getAttributes,
    );
  }

  getRawData(state) {
    return get(
      state,
      'cdmSourceList.dataSourceBusiness.data',
      {
        id: -1,
        isRegistered: false,
      },
      'Object',
    );
  }

  getData(rawDs) {
    return rawDs;
  }

  buildSelectorForGetData() {
    return createSelector(
      [this.getRawData],
      this.getData,
    );
  }

  build() {
    return {
      getAttrList: this.buildSelectorForGetAttrList(),
      getData: this.buildSelectorForGetData(),
    };
  }

}

export default CdmSourceListViewEditSelectorsBuilder;
