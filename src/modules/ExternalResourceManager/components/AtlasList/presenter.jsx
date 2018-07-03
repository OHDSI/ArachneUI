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
 * Authors: Pavel Grafkin
 * Created: March 14, 2018
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import Grid from 'components/Grid';
import { PageContent } from 'arachne-ui-components';
import Actions from './Actions';
import List from './List';
import ModalCreateEdit from './ModalCreateEdit';

require('./style.scss');

function AtlasList(props) {
  const classes = new BEMHelper('atlases');
  const {
    atlasList,
    checkConnection,
    editAtlas,
    deleteAtlas,
    isLoading,
    paginationDetails,
    reload,
    setSorting,
    sorting,
  } = props;

  return (
    <PageContent title="Atlases | Arachne">
      <Grid
        title="Atlases"
        isLoading={isLoading}
        paginationDetails={paginationDetails}
        Actions={<Actions reload={reload} />}
      >
        <List
          data={atlasList}
          sorting={sorting}
          setSorting={setSorting}
          checkConnection={checkConnection}
          editAtlas={editAtlas}
          deleteAtlas={deleteAtlas}
        />
      </Grid>
      <ModalCreateEdit />
    </PageContent>
  );
}

export default AtlasList;
