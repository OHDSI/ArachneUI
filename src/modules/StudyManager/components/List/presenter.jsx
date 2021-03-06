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
 * Created: July 25, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  PageContent,
  Toolbar,
  LoadingPanel,
} from 'arachne-ui-components';
import Grid from 'components/Grid';
import List from './List';
import Actions from './Actions';
import CreateModal from './CreateModal';

function StudyList(props) {
  const classes = new BEMHelper('studies-list');
  const {
    isLoading,
    isFilteredByMy,
    filterFields,
    paginationDetails,
    searchQueryDecode,
    searchQueryEncode,
  } = props;

  return (
    <PageContent title='My studies | Arachne'>
      <div {...classes()}>
        <Grid
          isLoading={isLoading}
          title={`${isFilteredByMy ? 'My' : ''} studies`}
          filterFields={filterFields}
          Actions={<Actions />}
          paginationDetails={paginationDetails}
          searchQueryDecode={searchQueryDecode}
          searchQueryEncode={searchQueryEncode}
        >
          <List />
        </Grid>
        <CreateModal />
      </div>
    </PageContent>
  );
}

export default StudyList;
