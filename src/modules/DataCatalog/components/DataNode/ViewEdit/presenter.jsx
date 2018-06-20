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
  * Created: Thursday, June 14, 2018 6:41 PM
  *
  */

import React from 'react';
import {
  PageContent,
  Toolbar,
  ListItem,
  Panel,
} from 'arachne-ui-components'
import EmptyState from 'components/EmptyState';
import BEMHelper from 'services/BemHelper';

import './style.scss';
import { paths } from 'modules/DataCatalog/const';
import isEmpty from 'lodash/isEmpty';

function ViewEdit(props) {
  const classes = new BEMHelper('view-edit');
  const {
    dataNode: {
      name,
      description,
    },
    organization,
    dataSources,
  } = props;

  return (      
    <PageContent title={`${name} | Arachne`}>
      <div {...classes()}>
        <Toolbar caption={`Data node: ${name}`} backUrl={paths.dataCatalog()} />
        <div {...classes('content')}>
          <div {...classes('block', 'shadowed')}>
            <ListItem>
              <div {...classes('attribute')}>
                <span {...classes('label')}>Organization</span>
                <span>{organization}</span>
              </div>
            </ListItem>
            <ListItem>
              {description}
            </ListItem>
          </div>
          <div {...classes('block')}>
            <Panel title={'Attached Data Sources'}>
              {dataSources.map(ds =>
                <ListItem>
                  {ds.name}
                </ListItem>
              )}
              {isEmpty(dataSources) &&
                <ListItem>
                  <EmptyState message={'No Data Sources attached to this Data Node yet'} />
                </ListItem>
              }
            </Panel>
          </div>
        </div>
      </div>
    </PageContent>
  );
}

export default ViewEdit;
