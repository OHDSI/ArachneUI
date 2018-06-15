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
 * Created: January 26, 2017
 *
 */

import { connect } from 'react-redux';
import { push as goToPage } from 'react-router-redux';
import { order } from 'const/sorting';
import { paths } from 'modules/DataCatalog/const';
import URI from 'urijs';
import DataSourcesTable from './presenter';

function mapStateToProps(state, ownProps) {
  const { pathname, query } = state.routing.locationBeforeTransitions;

  return {
    dataSourceList: ownProps.data,
    columns: ownProps.columns,
    searchParams: ownProps.searchParams,
    sorting: {
      sortBy: query.sort || 'name',
      sortAsc: query.order ? query.order === order.asc : order.asc,
    },
    pathname,
    query,
  };
}

const mapDispatchToProps = {
  doShowDatasource: url => goToPage(url),
  search: goToPage,
};


function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    setSorting: (sortParams) => {
      const uri = new URI(stateProps.pathname);
      uri.setSearch({
        ...stateProps.query,
        sort: sortParams.sortBy,
        order: sortParams.sortAsc ? order.asc : order.desc,
      });
      dispatchProps.search(uri.toString());
    },
    showDatasource(datasource) {
      const pathBuilder = ownProps.my ? paths.edit : paths.dataCatalog;
      const url = new URI(pathBuilder(datasource.id));
      if (ownProps.my) {
        url.setSearch({
          my: true,
        });
      }

      dispatchProps.doShowDatasource(url.href());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(DataSourcesTable);
