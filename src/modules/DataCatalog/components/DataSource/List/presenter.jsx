/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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

import BEMHelper from 'services/BemHelper';
import React, { PropTypes } from 'react';
import { PageContent } from 'arachne-ui-components';
import Grid from 'components/Grid';
import Actions from './Actions';
import DataSourcesTable from './Table';

require('./style.scss');

function DataCatalogList(props) {
  const classes = new BEMHelper('data-catalog');
  const {
    columns,
    data,
    filterFields,
    searchQueryDecode,
    searchQueryEncode,
    isLoading,
    paginationDetails,
  } = props;

  return (
    <PageContent title="Data catalog | Arachne">
      <div {...classes()}>
        <Grid
          isLoading={isLoading}
          title="Data catalog"
          filterFields={filterFields}
          Actions={<Actions />}
          paginationDetails={paginationDetails}
          searchQueryDecode={searchQueryDecode}
          searchQueryEncode={searchQueryEncode}
        >
          <div>
            <DataSourcesTable columns={columns} data={data} />
          </div>
        </Grid>
      </div>
    </PageContent>
  );
}

export default DataCatalogList;
