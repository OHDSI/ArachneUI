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
 * Created: January 31, 2018
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';

import {
  PageContent,
  LoadingPanel,
} from 'arachne-ui-components';

import Toolbar from 'modules/DataCatalog/components/ViewEdit/Toolbar';
import AttributeList from './AttributesList';

import './style.scss';

function Edit(props) {
  const classes = new BEMHelper('data-source-entry-editor');

  return (
    <PageContent title={`${props.name} | Arachne`}>
      <div {...classes()}>
        <Toolbar />
        <div {...classes('content')}>
          <AttributeList />
        </div>
      </div>
      <LoadingPanel active={props.isLoading} />
    </PageContent>
  );
}

Edit.propTypes = {
  isLoading: PropTypes.bool,
};

export default Edit;
