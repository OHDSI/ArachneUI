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
 * Authors: Sergey Suvorov
 * Created: September 27, 2021
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { Panel } from 'arachne-ui-components';
import PageWrapper from 'modules/Admin/components/PageWrapper';
import formFactory from 'components/DynamicDataForm/factory';
import ProtectedView from 'modules/Admin/components/ProtectedView';

require('./style.scss');

function OperationalDashboard(props) {
  const classes = new BEMHelper('admin-panel-operational-dashboard');
  const {
    dashboardGroupList,
  } = props;

  const formComponentList = dashboardGroupList.map((group, index) => {
    const Form = formFactory({
      name: group.name,
      initialValues: group.initialValues,
    });
    return (
      <div className="col-xs-12 col-md-6" key={index}>
        <div {...classes('panel')}>
          <Panel title={group.label}>
            <Form
              dynamicFields={group.fieldList}
            />
          </Panel>
        </div>
      </div>
    )
  })

  return (
    <ProtectedView>
      <PageWrapper>
        <div {...classes()}>
          <div {...classes('content')}>
            <div className="row">
              {formComponentList}
            </div>
          </div>
        </div>
      </PageWrapper>
    </ProtectedView>
  );
}

export default OperationalDashboard;
