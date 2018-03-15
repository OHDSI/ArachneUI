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
 * Authors: Pavel Grafkin
 * Created: March 14, 2018
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import Grid from 'components/Grid';
import PageWrapper from 'modules/Admin/components/PageWrapper';
import Actions from './Actions';
import List from './List';
import ModalCreateEdit from './ModalCreateEdit';

require('./style.scss');

function AtlasList(props) {
  const classes = new BEMHelper('atlases');
  const {
    atlasList,
    editAtlas,
    deleteAtlas,
    isLoading,
    paginationDetails,
    setSorting,
    sorting,
  } = props;

  return (
    <PageWrapper>
      <Grid
        title="Atlases"
        isLoading={isLoading}
        paginationDetails={paginationDetails}
        Actions={<Actions />}
      >
        <List data={atlasList} sorting={sorting} setSorting={setSorting} editAtlas={editAtlas} deleteAtlas={deleteAtlas} />
      </Grid>
      <ModalCreateEdit />
    </PageWrapper>
  );
}

export default AtlasList;
