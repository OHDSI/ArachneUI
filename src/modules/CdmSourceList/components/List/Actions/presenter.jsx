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
 * Created: December 20, 2016
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { Button } from 'arachne-ui-components';

require('./style.scss');

function CdmSourceListActions({ startCreatingDataSource, reloadList }) {
  const classes = new BEMHelper('data-source-list-actions');
  
  return (
    <ul {...classes()}>
    	<li {...classes('action')}>
    		<Button {...classes('btn')} onClick={startCreatingDataSource}>
          <i {...classes('btn-ico')}>add_circle_outline</i>
        </Button>
    	</li>
      <li {...classes('action')}>
        <Button {...classes('btn')} onClick={reloadList}>
          <i {...classes('btn-ico')}>refresh</i>
        </Button>
      </li>
    </ul>
  );
}

export default CdmSourceListActions;