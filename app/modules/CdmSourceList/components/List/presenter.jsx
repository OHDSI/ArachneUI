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
 * Created: December 28, 2016
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';

import { PageContent } from 'arachne-components';
import { LoadingPanel } from 'arachne-components';
import { Toolbar } from 'arachne-components';
import Actions from './Actions/index';
import Table from './Table/index';
import ModalCreateEdit from './ModalCreateEdit/index';
import ModalCreateDataNode from './ModalCreateDataNode';

require('./style.scss');

function List({ isLoading }) {
  const classes = new BEMHelper('data-catalog-list');

  return (
    <PageContent title='CDM Data sources | Arachne'>
      <div {...classes()}>
        <Toolbar caption="CDM Data sources">
          <Actions />
        </Toolbar>
        <Table />
        <ModalCreateEdit />
        <ModalCreateDataNode />
        <LoadingPanel active={isLoading} />
      </div>
    </PageContent>
  );
}

List.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export default List;
