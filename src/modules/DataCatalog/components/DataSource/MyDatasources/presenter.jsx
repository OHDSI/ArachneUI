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
  * Created: Tuesday, February 13, 2018 5:37 PM
  *
  */

  import React from 'react';
  import Grid from 'components/Grid';  
  import { PageContent } from 'arachne-ui-components';
  import BEMHelper from 'services/BemHelper';
  import DataSourcesTable from '../List/Table';
  import Actions from './components/Actions';
  import ModalCreateDatanode from './components/ModalCreateDatanode';
  import ModalCreateDataSource from './components/ModalCreateDataSource';
  
  import './style.scss';
  
  function MyDatasources(props) {
    const classes = new BEMHelper('my-datasources');
    const {
      columns,
      data,
      filterFields,
      searchQueryDecode,
      searchQueryEncode,
      isLoading,
      paginationDetails,
      onPageOutOfRange,
    } = props;

    return (
      <PageContent title="My Datasources | Arachne">
        <div {...classes()}>
          <Grid
            isLoading={isLoading}
            title="My Datasources"
            filterFields={filterFields}
            Actions={<Actions />}
            paginationDetails={paginationDetails}
            searchQueryDecode={searchQueryDecode}
            searchQueryEncode={searchQueryEncode}
            onPageOutOfRange={onPageOutOfRange}
          >
            <div>
              <DataSourcesTable columns={columns} data={data} my />
            </div>
          </Grid>
        </div>
        <ModalCreateDatanode />
        <ModalCreateDataSource />
      </PageContent>
    );
  }
  
  export default MyDatasources;
  
