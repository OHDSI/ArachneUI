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
 * Created: February 06, 2017
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import { modelTypesValues } from 'const/dataSource'

import {
  PageContent,
  LoadingPanel,
  Tabs,
} from 'arachne-ui-components';

import Toolbar from './Toolbar/index';
import AttributesList from './AttributesList';
import ModalInviteToStudy from './ModalInviteToStudy';
import ModalConfirmDatasource from './ModalConfirmDatasource';
import Report from './Report';
import Actions from './Actions';

require('./style.scss');

function ViewEdit(props) {
  const classes = new BEMHelper('data-source-entry');

  return (
    <PageContent title={`${props.name} | Arachne`}>
      <div {...classes()}>
        <Toolbar />
        <Actions
          isProfileSelected={props.isProfileSelected}
          dataSourceId={props.dataSourceId}
          reportsAvailable={props.reportsAvailable && props.modelType === modelTypesValues.CDM}
        />
        {props.reportsAvailable && props.isProfileSelected
          ? <div {...classes('content')}>
              <Report dataSourceId={props.dataSourceId} />
            </div>
          : <div {...classes('content')}>
              <AttributesList />
            </div>
        }
      </div>
      <LoadingPanel active={props.isLoading} />
      <ModalInviteToStudy />
      <ModalConfirmDatasource />
    </PageContent>
  );
}

ViewEdit.propTypes = {
  isLoading: PropTypes.bool,
};

export default ViewEdit;
