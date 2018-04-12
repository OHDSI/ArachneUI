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

// @ts-check
import { createSelector } from 'reselect';
import { Utils, get } from 'services/Utils';
import dsInfoConvert from 'modules/DataCatalog/converters/dsInfoConvertor';
import { types as fieldTypes } from 'const/modelAttributes';
import cloneDeep from 'lodash/cloneDeep';
import DsAttrListSelector from 'modules/DataCatalog/selectors/DsAttrListSelector';
import { extractPaginationData } from 'components/Grid';
import { viewModePageSize } from 'const/viewModes';

class DataCatalogListTableSelectorsBuilder extends DsAttrListSelector {

  // Dummy getters

  getSearchStr(state) {
    return get(state, 'routing.locationBeforeTransitions.query', '');
  }

  getRawDataSourceList(state) {
    return get(state, 'dataCatalog.dataSourceList.queryResult.result.content', [], 'Array');
  }

  getFacets(state) {
    return get(state, 'dataCatalog.dataSourceList.queryResult.result.facets');
  }

  getPaginationDetails(state) {
    const searchResults = get(state, 'dataCatalog.dataSourceList.queryResult.result');
    return extractPaginationData({
      searchResults,
      numOfElsPerPage: viewModePageSize.DEFAULT,
      startsFromOne: true,
    });
  }

  // Columns selector

  getColumns(attrList) {
    return attrList.filter(attr => attr.showInList);
  }

  buildSelectorForGetColumns(getAttrList) {
    return createSelector(getAttrList, this.getColumns);
  }

  // Filter options selector

  getFilterList(attrList, facets) {
    const filterList = attrList
      // Remove attributes that should not be shown in Filter panel
      .filter(attr => attr.faceted)
      .map(cloneDeep)
      // Compute options for filter sections
      .map((attr) => {
        if (attr.type === fieldTypes.string && facets) {
          attr.options = Object.keys(facets[attr.name] || {}).map(key => ({ label: key, value: key }));
        }
        return attr;
      })
      // Assign facet counts
      .filter((attr) => {
        if ([fieldTypes.enum, fieldTypes.enumMulti].includes(attr.type)) {
          // hide enum attributes with no options
          return Object.values(attr.options).length !== 0;
        }

        // also hide text attributes (temporary)
        return attr.type !== fieldTypes.string || Array.isArray(attr.options);
      });

    // Assign facets
    if (facets) {
      Utils.assignFacets(filterList, facets);
    }

    return filterList;
  }

  buildSelectorForGetFilterList(getAttrList) {
    return createSelector(
      getAttrList,
      this.getFacets,
      this.getFilterList
    );
  }

  // Data selector

  getDataSourceList(rawDataSourceList, attrList) {
    const columns = attrList.filter(attr => attr.showInList);
    return rawDataSourceList.map(ds => dsInfoConvert(ds, columns));
  }

  buildSelectorForGetDataSourceList(getAttrList) {
    return createSelector(
      this.getRawDataSourceList,
      getAttrList,
      this.getDataSourceList
    );
  }

  // Build

  build() {
    const getAttrList = this.buildSelectorForGetAttrList();
    const getColumns = this.buildSelectorForGetColumns(getAttrList);
    const getDataSourceList = this.buildSelectorForGetDataSourceList(getAttrList);
    const getFilterList = this.buildSelectorForGetFilterList(getAttrList);
    return {
      getColumns,
      getData: getDataSourceList,
      getFilterList,
      getSearchStr: this.getSearchStr,
      getPaginationDetails: this.getPaginationDetails,
    };
  }
}

export default DataCatalogListTableSelectorsBuilder;
