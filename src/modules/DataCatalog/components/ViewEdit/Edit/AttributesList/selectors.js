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
 * Created: January 31, 2018
 *
 */

import { createSelector } from 'reselect';
import { get } from 'services/Utils';
import DsAttrListSelector from 'modules/DataCatalog/selectors/DsAttrListSelector';
import { staticAttrList, immutableAttributes } from 'const/dataSource';

class DataCatalogListViewAttributesSelectorsBuilder extends DsAttrListSelector {

  getRawData(state) {
    return get(state, 'dataCatalog.dataSource.data.result', {}, 'Object');
  }

  getAttrList(state) {
    return staticAttrList.filter(el => !el.calculated);
  }

  getValues(state) {
    return get(state, 'form.editDataSource.values', {}, 'Object');
  }

  getDbmsTypes(state) {
    return get(state, 'dataCatalog.dbmsTypes.data', [], 'Array').map(type => ({
      label: type.name,
      value: type.id,
    }));
  }

  checkImmutability(attrList, immutableAttributesList) {
    return attrList.map(attr => ({
      ...attr,
      isImmutable: immutableAttributesList.includes(attr.name),
    }));
  }

  getAttributes(attrList, values) {
    return this.checkImmutability(attrList, immutableAttributes);
  }

  buildSelectorForGetAttrList() {
    return createSelector(
      [this.getAttrList.bind(this), this.getValues],
      this.getAttributes.bind(this),
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
      getValues: this.getValues,
      getDbmsTypes: this.getDbmsTypes,
    };
  }

}

export default DataCatalogListViewAttributesSelectorsBuilder;
