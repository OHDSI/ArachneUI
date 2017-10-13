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
 * Created: April 26, 2017
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import {
	Form,
	FormInput,
	LoadingPanel,
	PageContent,
	Toolbar
} from 'arachne-ui-components';

import FormPassword from './FormPassword';

require('./style.scss');

function Settings(props) {
  const classes = new BEMHelper('portal-settings');

  return (
    <PageContent title='Settings | Arachne'>
      <div {...classes()}>
        <Toolbar
          caption={'Settings'}
        />
        <div {...classes('content')}>
        	<div className="row">
        		<div className="col-xs-12 col-md-4">
        			<FormPassword {...classes('panel')} />
        		</div>
        	</div>
        </div>
        <LoadingPanel active={false}/>
      </div>
    </PageContent>
  );
}

export default Settings;
