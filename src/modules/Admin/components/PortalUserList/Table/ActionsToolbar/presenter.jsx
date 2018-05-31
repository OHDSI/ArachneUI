/*
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
 * Authors: Anton Gackovka
 * Created: May 23, 2018
 */

import BEMHelper from 'services/BemHelper';
import isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import { Button } from 'arachne-ui-components';
import { batchOperationType } from 'modules/Admin/const';
import pluralize from 'pluralize';

require('./style.scss');

/** @augments{ Component<any, any>} */
export default class ActionsToolbar extends Component{

  
  getButtons() {
    
    return [
      {
        onClick: () => 'open batch user creating modal',
        tooltipText: 'New users',
        icon: 'add_circle_outline',
      },
      this.createButton({
        onClick: this.props.batch.bind(null, batchOperationType.RESEND),
        tooltipText: 'Resend emails',
        icon: 'email',
      }),
      this.createButton({
        onClick: this.props.batch.bind(null, batchOperationType.ENABLE),
        tooltipText: 'Enable/Disable',
        icon: 'done',
      }),
      this.createButton({
        onClick: this.props.batch.bind(null, batchOperationType.CONFIRM),
        tooltipText: 'Confirm/Invalidate email',
        icon: 'verified_user',
      }),
      this.createButton({
        onClick: this.props.batch.bind(null, batchOperationType.DELETE),
        tooltipText: 'Delete',
        icon: 'delete',
      }),
    ];
  }

  createButton({ onClick, tooltipText, icon }) {
    
    const areUsersSelected = !isEmpty(this.props.selectedUsers);
    return {
      disabled: !areUsersSelected,
      onClick: areUsersSelected ? onClick : () => {},
      tooltipText: areUsersSelected ? tooltipText : "Select users first",
      icon: icon,
    }
  }
  

  render() {

    const classes = new BEMHelper('admin-portal-user-list-actions-toolbar');
    const tooltipClass = new BEMHelper('tooltip');
    
    return (
        <div {...classes()}>
          <div>
            {
              this.getButtons().map(buttonSettings =>
                <Button onClick={buttonSettings.onClick}>
                  <i 
                    {...classes({element: 'btn-ico', modifiers: { disabled: buttonSettings.disabled }, extra: tooltipClass().className})}
                    aria-label={buttonSettings.tooltipText}
                    data-tootik-conf="bottom"
                  >{buttonSettings.icon}</i>
                </Button>)
            }
          </div>
          <span>{`Selected ${pluralize('element', this.props.selectedUsers.length, true)}`}</span>
        </div>
    );
  }
}