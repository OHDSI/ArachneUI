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
} from 'arachne-ui-components';

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
    className,
  } = props;

  const format = '0,0';
  const resultsCountMessage = (pageStart !== null && totalResults !== null && showing !== null)
    ? `Showing ${numeral(pageStart + 1).format(format)} - ${numeral(Math.min(pageStart + showing, totalResults)).format(format)} from ${numeral(totalResults).format(format)} results`
    : '';

  const filterProps = {
    fields: filterFields,
    queryEncode: searchQueryEncode,
    queryDecode: searchQueryDecode,
  };

  let extraClasses = () => ({});
  if (className) {
    extraClasses = BEMHelper(className, false);
  }

  return (
    <div {...classes({ extra: extraClasses().className })}>
      <div
        {...classes({
          element: 'filter-col',
          extra: extraClasses('filter-col').className,
        })}
      >
        <FilterForm {...filterProps} type={filterTypes.column} />
      </div>
      <div
        {...classes({
          element: 'main-area',
          extra: extraClasses('main-area').className,
        })}
      >
        <Toolbar caption={title}>
          <FilterForm {...filterProps} type={filterTypes.dropdown} />
          {Actions}
        </Toolbar>
        <div
          {...classes({
            element: 'content-wrapper',
            extra: extraClasses('content-wrapper').className,
          })}
        >
          {children}
          <div
            {...classes({
              element: 'pagination-wrapper',
              extra: extraClasses('pagination-wrapper').className,
            })}
          >
            <div
              {...classes({
                element: 'pagination',
                extra: extraClasses('pagination').className,
              })}
            >
              <Pagination pages={pages} currentPage={currentPage} path={path} />
            </div>
            <div
              {...classes({
                element: 'results-count',
                extra: extraClasses('results-count').className,
              })}
            >
              <span>{resultsCountMessage}</span>
            </div>
          </div>
        </div>
        <LoadingPanel active={isLoading} />
      </div>
    </div>
  );
}

export default Grid;
