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
 * Created: August 02, 2017
 *
 */
// @ts-check
import React, { Component, PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import { Modal, Tabs } from 'arachne-ui-components';
import { publishStateOptions } from 'modules/InsightsLibrary/const';

import './style.scss';

/** @augments{ Component<any, any>} */
export default class ModalAccessSettings extends Component {
  constructor() {
    super();
    this.classes = BEMHelper('insight-modal-settings');
  }

  getSettings() {
    return [
      <div {...this.classes('setting')}>
        <div {...this.classes('setting-title')}>Publish state</div>
        <Tabs
          {...this.classes({
            element: 'setting-value',
            modifiers: { disabled: !this.canPublishPaper }})}
          onChange={this.changePublishState}
          options={publishStateOptions}
          value={this.publishState}
        />
      </div>
    ]
  }

  render() {
    this.publishState = this.props.publishState;
    this.insightId = this.props.insightId;
    this.changePublishState = this.props.changePublishState;
    this.canPublishPaper = this.props.canPublishPaper;

    return (
      <div {...this.classes()}>
        <Modal modal={this.props.modal} title="Insight settings">
          <div {...this.classes('content')}>
            {this.getSettings()}
          </div>
        </Modal>
      </div>
    )
  }
}