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
 * Created: January 16, 2017
 *
 */

import BEMHelper from 'services/BemHelper';
import React, { PropTypes } from 'react';
import { Link } from 'arachne-ui-components';
import { PanelEditable } from 'arachne-ui-components';
import { Panel } from 'arachne-ui-components';
import { Form } from 'arachne-ui-components';
import { FormTextarea } from 'arachne-ui-components';
import View from './View/index';
import Edit from './Edit/index';

require('./style.scss');

function Summary(props) {
  const { text, editable } = props;
  const classes = new BEMHelper('profile-summary');

  return (
    editable ? 
      <PanelEditable
        {...classes()}
        title="Personal summary"
        viewContent={<View {...classes({ element: 'content', modifiers: { view: true, empty: !text } })} {...props} />}
        editContent={<Edit {...classes('content')} {...props} userId={props.userId}/>}
      />
      :
      <Panel 
        {...classes()}
        title="Personal Summary">
        <View {...classes('content', 'view')} text={text} />
      </Panel>
  );
}

Summary.PropTypes = {
  editable: PropTypes.bool,
  text: PropTypes.string,
};
export default Summary;
