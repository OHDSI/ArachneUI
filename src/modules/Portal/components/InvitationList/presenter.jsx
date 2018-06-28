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
 * Created: January 30, 2017
 *
 */

import React, { PropTypes } from 'react';
import { BadgedIcon } from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import { Panel } from 'arachne-ui-components';
import { LoadingPanel } from 'arachne-ui-components';
import ActivityListItem from './ActivityListItem';
import ModalRejectInvitation from './ModalRejectInvitation';

require('./style.scss');

function InvitationList(props) {
  const classes = new BEMHelper('notify-dropdown');

  return (
    <Dropdown {...classes()}>
      <DropdownTrigger {...classes('icon')}>
        <BadgedIcon count={props.unreadCount} icon="person" />
      </DropdownTrigger>
      <DropdownContent>
        <Panel title="Requests" mods="black-header" {...classes('content')}>
          {!props.invitations.length &&
            <span {...classes('empty-state')}>No invitations</span>
          }
          <ul {...classes('list')}>{props.invitations.map((item, key) =>
            <ActivityListItem {...item} key={key} performAction={props.performAction} />)
          }</ul>
          <LoadingPanel active={props.isLoading}/>
          <ModalRejectInvitation />
        </Panel>
      </DropdownContent>
    </Dropdown>
  );
}

InvitationList.propTypes = {
  unreadCount: PropTypes.number,
  invitations: PropTypes.array.isRequired,
  performAction: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default InvitationList;
