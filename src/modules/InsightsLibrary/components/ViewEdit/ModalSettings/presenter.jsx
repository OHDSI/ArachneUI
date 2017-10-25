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
 * Created: August 02, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { Modal, Tabs } from 'arachne-ui-components';
import { publishStateOptions } from 'modules/InsightsLibrary/const';

require('./style.scss');

function ModalAccessSettings(props) {
  const classes = new BEMHelper('insight-modal-settings');
  const {
    publishState,
    insightId,
    changePublishState,
    canPublishPaper
  } = props;

  return (
    <div {...classes()}>
      <Modal modal={props.modal} title="Insight settings">
        <div {...classes('content')}>
          <div {...classes('setting')}>
            <div {...classes('setting-title')}>Publish state</div>
            <Tabs
              {...classes({ element: 'setting-value',
                modifiers: { disabled: !canPublishPaper } })}
              onChange={changePublishState}
              options={publishStateOptions}
              value={publishState}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ModalAccessSettings;
