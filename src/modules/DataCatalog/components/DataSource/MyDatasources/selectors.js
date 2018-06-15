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
  * Created: Tuesday, February 13, 2018 5:37 PM
  *
  */

import { createSelector } from 'reselect';
import { extractPaginationData } from 'components/Grid';
import { viewModePageSize } from 'const/viewModes';
import DsAttrListSelector from 'modules/DataCatalog/selectors/DsAttrListSelector';
import get from 'lodash/get';
import dsInfoConvertor from 'modules/DataCatalog/converters/dsInfoConvertor';

export default class SelectorsBuilder extends DsAttrListSelector {

  getRawDataSourceList(state) {
    return get(state, 'dataCatalog.myDatasources.queryResult.content', [], 'Array');
  }

  getPaginationDetails(state) {
    const searchResults = get(state, 'dataCatalog.myDatasources.queryResult');
    return extractPaginationData({
      searchResults,
      numOfElsPerPage: viewModePageSize.DEFAULT,
      startsFromOne: false,
    });
  }

  getColumns(attrList) {
    return [
      ...attrList.filter(attr => attr.showInList),
      {
        label: 'Published',
        name: 'publishedLabel',
      },
    ];
  }

  buildSelectorForGetColumns(getAttrList) {
    return createSelector(getAttrList, this.getColumns);
  }

  getDataSourceList(rawDataSourceList, attrList) {
    const columns = attrList.filter(attr => attr.showInList);
    return rawDataSourceList.map(ds => dsInfoConvertor(ds, columns));
  }

  buildSelectorForGetDataSourceList(getAttrList) {
    return createSelector(
      this.getRawDataSourceList,
      getAttrList,
      this.getDataSourceList
    );
  }

  build() {
    const getAttrList = this.buildSelectorForGetAttrList();
    const getColumns = this.buildSelectorForGetColumns(getAttrList);
    const getDataSourceList = this.buildSelectorForGetDataSourceList(getAttrList);
    return {
      getColumns,
      getPaginationDetails: this.getPaginationDetails,
      getData: getDataSourceList,
    };
  }
}
