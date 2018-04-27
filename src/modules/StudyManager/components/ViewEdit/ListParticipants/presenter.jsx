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
 * Created: December 27, 2016
 *
 */

import React, { PropTypes } from 'react';
import DraggableList from 'react-draggable-list';
import { ListItem, Link, Select } from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import { newParticipantRolesOptions, participantRoles } from 'modules/StudyManager/const';

require('./style.scss');

function ParticipantItem(props) {
  const classes = new BEMHelper('study-participants-item');
  const tootlopClasses = new BEMHelper('tooltip');
  const {
    participant,
    hasEditPermissions,
    addParticipant,
    changeRole,
    removeParticipant,
  } = props;

  const mods = {
    hover: true,
    actionable: hasEditPermissions,
  };

  const actions = [];

  if (participant.canBeRecreated) {
    actions.push(
      <span
        {...classes('action')}
        onClick={
          () => addParticipant({
            userId: participant.id,
            role: participant.role.id
          })
        }
      >
        <i {...classes('action-ico', 'recreate')}>
          cached
        </i>
      </span>
    );
  }

  if (participant.canBeRemoved) {
    actions.push(
      <span
        {...classes('action')}
        onClick={() => removeParticipant(participant.id, participant.fullName)}
      >
        <i {...classes('action-ico', 'remove')}>
          close
        </i>
      </span>
    );
  }


  return (
    <ListItem
      {...classes({
        modifiers: {
          displaced: hasEditPermissions && !participant.canBeRemoved && !participant.canBeRecreated,
        }
      })}
      mods={mods}
      actions={actions}
    >
      <div {...classes('name')}>
        <Link to={participant.link}>{participant.fullName}</Link>
        {participant.comment &&
          <Link
            {...classes({ element: 'comment', extra: 'ac-tooltip' })}
            aria-label={`Comment: ${participant.comment}`}
            data-tootik-conf='top multiline'
          >
            <div {...classes('comment-icon')}>chat_bubble</div>
          </Link>
        }
      </div>
      <div {...classes('role')}>
        <div 
          className={participant.role.id === participantRoles.DATA_SET_OWNER ? tootlopClasses().className : null}
          aria-label={participant.role.id === participantRoles.DATA_SET_OWNER
            ? `User was added automatically as following data source owner: ${participant.ownedDataSource.name}`
            : null
          }
          data-tootik-conf='left multiline'
        >
          {participant.canBeRemoved ?
            <Select
              {...classes('role-select')}
              mods={['bordered']}
              placeholder="Role"
              value={participant.role.id}
              isMulti={false}
              options={newParticipantRolesOptions}
              onChange={(value) => changeRole(participant.id, value)}
            />
            :
            <span>
              {participant.role.name}
            </span>
          }
        </div>
      </div>
      <div {...classes('status', participant.status)}>
        {participant.status}
      </div>
    </ListItem>
  );
}

ParticipantItem.propTypes = {
  participant: PropTypes.object.isRequired,
  removeParticipant: PropTypes.func.isRequired,
}

function ListParticipants(props) {
  const classes = new BEMHelper('study-participants-list');
  const {
    addParticipant,
    hasEditPermissions,
    changeRole,
    openAddParticipantModal,
    participantList,
    removeParticipant,
  } = props;

  return (
    <ul {...classes()}>
      {participantList.map((participant, key) =>
        <ParticipantItem
          participant={participant}
          hasEditPermissions={hasEditPermissions}
          addParticipant={addParticipant}
          changeRole={changeRole}
          removeParticipant={removeParticipant}
          key={key}
        />
    	)}
      {participantList.length === 0 &&
      	<ListItem label="No participants" />
      }
      {hasEditPermissions &&
        <ListItem label="Add participant" mods="add" onClick={openAddParticipantModal} />
      }
    </ul>
  );
}

ListParticipants.propTypes = {
  hasEditPermissions: PropTypes.bool.isRequired,
  openAddParticipantModal: PropTypes.func.isRequired,
  participantList: PropTypes.array.isRequired,
  removeParticipant: PropTypes.func.isRequired,
}

export default ListParticipants;
