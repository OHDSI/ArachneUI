/*
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
 * Authors: Anton Gackovka
 * Created: May 23, 2018
 */

import React, { Component } from 'react';
import { Toolbar, Button } from 'arachne-ui-components';
import { batchOperationType } from 'modules/Admin/const';

require('./style.scss');

/**
 * @return {null}
 */
export default class ActionsToolbar extends Component{

  getButtons() {
    return [
      {
        onClick: 'new users',
        label: 'New users',
      },
      {
        onClick: this.props.batch.bind(null, batchOperationType.RESEND),
        label: 'Resend emails',
      },
      {
        onClick: this.props.batch.bind(null, batchOperationType.ENABLE),
        label: 'Enable/Disable',
      },
      {
        onClick: this.props.batch.bind(null, batchOperationType.CONFIRM),
        label: 'Confirm/Invalidate email',
      },
      {
        onClick: this.props.batch.bind(null, batchOperationType.DELETE),
        label: 'Delete',
      },
    ];
  }

  render() {

    return (
      this.props.selectedUsers.length > 0 ?
        <Toolbar>
          {
            this.getButtons().map(buttonSettings => <Button {...buttonSettings} />)
          }
          <span>{`Selected ${this.props.selectedUsers.length} elements`}</span>
        </Toolbar>
        :
        null
    );
  }
}