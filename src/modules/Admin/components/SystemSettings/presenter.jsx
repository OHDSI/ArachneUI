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
 * Created: April 14, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { Button, Panel } from 'arachne-ui-components';
import PageWrapper from 'modules/Admin/components/PageWrapper';
// import DynamicDataForm from 'components/DynamicDataForm';
import formFactory from 'components/DynamicDataForm/factory';
import {
	LoadingPanel,
} from 'arachne-ui-components';

require('./style.scss');

function SystemSettings(props) {
	const classes = new BEMHelper('admin-panel-sys-settings');
	const {
		isApplied,
		applySettings,
		isLoading,
		doSubmit,
		settingGroupList,
	} = props;

	const formComponentList = settingGroupList.map((formData, index) => {
		const Form = formFactory({
			name: formData.name,
			initialValues: formData.initialValues,
		});
		return (
			<div className="col-xs-12 col-md-6" key={index}>
				<div {...classes('panel')}>
			    <Panel title={formData.label}>
			    	<Form
							dynamicFields={formData.fieldList}
							doSubmit={(data) => doSubmit(formData.name, data)}
						/>
					</Panel>
				</div>
			</div>
		)
	})

	return (
		<PageWrapper>
			<div {...classes()}>
				{!isApplied &&
					<div {...classes('apply-banner')}>
						<span {...classes('apply-banner-hint')}>
							Some settings were changed, but have not been applied yet. To apply settings, you need to restart server.
						</span>
						<Button
							{...classes('apply-banner-btn')}
							label={'Restart server'}
							onClick={applySettings}
						/>
					</div>
				}
				<div {...classes('content')}>
					<div className="row">
						{formComponentList}
					</div>
				</div>
			</div>
      <LoadingPanel active={ isLoading } />
		</PageWrapper>
	);
}

export default SystemSettings;
