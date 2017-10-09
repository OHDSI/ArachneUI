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
 * Created: September 29, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import filterTypes from 'const/filterTypes';
import numeral from 'numeral';
import {
  LoadingPanel,
  Pagination,
  Toolbar,
} from 'arachne-components';

import FilterFormBuilder from 'components/FiltersList/filter-form';
const FilterForm = (new FilterFormBuilder({ formName: 'grid-filter' })).build();

require('./style.scss');

function Grid(props) {
  const classes = new BEMHelper('grid');
  const {
    isLoading,
    filterFields,
    searchQueryEncode = null,
    searchQueryDecode = null,
    Actions = null,
    title,
    children,
    paginationDetails: {
      pages,
      currentPage,
      totalResults = null,
      showing = null,
      pageStart = null,
    },
    path,
  } = props;

  const format = '0,0';
  const resultsCountMessage = (pageStart !== null && totalResults !== null && pageStart !== null)
    ? `Showing ${numeral(pageStart + 1).format(format)} - ${numeral(pageStart + showing).format(format)} from ${numeral(totalResults).format(format)} results`
    : '';

  const filterProps = {
    fields: filterFields,
    queryEncode: searchQueryEncode,
    queryDecode: searchQueryDecode,
  };

  return (
    <div {...classes()}>
      <div {...classes('filter-col')}>
          <FilterForm {...filterProps} type={filterTypes.column} />
        </div>
        <div {...classes('main-area')}>
          <Toolbar caption={title}>
            <FilterForm {...filterProps} type={filterTypes.dropdown} />
            {Actions}
          </Toolbar>
          <div {...classes('content-wrapper')}>
            {children}
            <div {...classes('pagination-wrapper')}>
              <div {...classes('pagination')}>
                <Pagination pages={pages} currentPage={currentPage} path={path} />
              </div>
              {pages > 1 &&
                <div {...classes('results-count')}>
                  <span>{resultsCountMessage}</span>
                </div>
              }
            </div>
          </div>
          <LoadingPanel active={isLoading} />
        </div>
    </div>
  );
}

export default Grid;
