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
 * Created: February 06, 2017
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import { modelTypesValues } from 'const/dataSource'

import {
  PageContent,
  LoadingPanel,
} from 'arachne-ui-components';
import EmptyState from 'components/EmptyState';
import Toolbar from 'modules/DataCatalog/components/DataSource/ViewEdit/Toolbar';
import AttributesList from './AttributesList';
import ModalInviteToStudy from './ModalInviteToStudy';
import ModalConfirmDatasource from './ModalConfirmDatasource';
import Report from './Report';
import Actions from './Actions';

require('./style.scss');

function View(props) {
  const classes = new BEMHelper('data-source-entry');
  let content = (
    <div {...classes('content')}>
      <AttributesList />
    </div>
  );
  if (props.reportsAccessAvailable && props.isProfileSelected) {
    content = (
      <div {...classes('content')}>
        <Report dataSourceId={props.dataSourceId} />
      </div>
    );
  }

  return (
    <PageContent title={`${props.name} | Arachne`}>
      <div {...classes()}>
        {props.isDenied
          ? <EmptyState message={'You do not have rights to view this data source'} />
          : [
            <Toolbar mode={'view'} />,
            <Actions
              isProfileSelected={props.isProfileSelected}
              dataSourceId={props.dataSourceId}
              reportsAvailable={props.reportsAccessAvailable && props.characterizationAvailable}
            />,
            content,
          ]
        }
      </div>
      <LoadingPanel active={props.isLoading} />
      <ModalInviteToStudy />
      <ModalConfirmDatasource />
    </PageContent>
  );
}

View.propTypes = {
  isLoading: PropTypes.bool,
};

export default View;
