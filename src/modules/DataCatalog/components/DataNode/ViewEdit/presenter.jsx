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
  * Created: June 14, 2018
  *
  */

import React from 'react';
import {
  PageContent,
  Toolbar,
  ListItem,
  Panel,
  Button,
  PanelEditable,
} from 'arachne-ui-components'
import EmptyState from 'components/EmptyState';
import BEMHelper from 'services/BemHelper';

import isEmpty from 'lodash/isEmpty';
import LabelDataSource from 'components/LabelDataSource';
import './style.scss';
import EditDataNodeTitle from 'modules/DataCatalog/components/DataNode/ViewEdit/components/EditDataNodeTitle';
import ViewCommonData from 'modules/DataCatalog/components/DataNode/ViewEdit/components/ViewCommonData';
import EditCommonData from 'modules/DataCatalog/components/DataNode/ViewEdit/components/EditCommonData';

function ViewEdit(props) {
  const classes = new BEMHelper('view-edit');
  const {
    id,
    dataNode: {
      name,
      description,
      editable,
      organization,
    },
    dataSources,
    showNameEditDialog,
    goBack,
  } = props;
  const caption = <div {...classes('toolbar')}>
    <Button onClick={goBack} {...classes('back')}>
      <i {...classes('back-icon')}>
        arrow_back
      </i>
    </Button>
    <span>Data node: {name}</span>
    {editable &&
      <Button {...classes('edit-button')} onClick={showNameEditDialog}>mode_edit</Button>
    }
  </div>;              

  return (
    <PageContent title={`${name} | Arachne`}>
      <div {...classes()}>
        <Toolbar caption={caption} />
        <div {...classes('content')}>
          <PanelEditable
            {...classes('block')}
            title={'Common data'}
            viewContent={<ViewCommonData description={description} organization={organization} />}
            editContent={<EditCommonData description={description} organization={organization} datanodeId={id} />}
          />
          <div {...classes('block')}>
            <Panel title={'Attached Data Sources'}>
              {dataSources.map(ds =>
                <ListItem>
                  <LabelDataSource {...ds} />
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
      <EditDataNodeTitle />
    </PageContent>
  );
}

export default ViewEdit;
