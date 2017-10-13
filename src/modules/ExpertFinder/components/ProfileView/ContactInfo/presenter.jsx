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
 * Created: February 15, 2017
 *
 */

import BEMHelper from 'services/BemHelper';
import React, { PropTypes } from 'react';
import { Link } from 'arachne-ui-components';
import { Panel } from 'arachne-ui-components';
import { PanelEditable } from 'arachne-ui-components';
import BasicInfoView from './View';
import BasicInfoEdit from './Edit';

require('./style.scss');

function ContactInfo(props) {
  const classes = new BEMHelper('profile-info');
  const title = "Contact Information";
  const { editable } = props;

  return (
    editable ? 
      <PanelEditable 
        title={title}
        viewContent={<BasicInfoView {...props} />}
        editContent={<BasicInfoEdit {...classes('content')} />}
        >
      </PanelEditable>
      :
      <Panel
        title={title}>
        <BasicInfoView {...props}/> 
      </Panel>   
  );
}

export default ContactInfo;