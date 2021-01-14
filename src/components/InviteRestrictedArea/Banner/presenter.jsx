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
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon
 * Created: December 11, 2017
 *
 */
import React from 'react';
import { Avatar, Button, Link } from 'arachne-ui-components';
import {
  apiPaths as activityApiPaths,
} from 'const/activity';
import { paths } from 'modules/StudyManager/const';
import BEMHelper from 'services/BemHelper';
import DeclineModal from 'modules/Portal/components/InvitationList/ModalRejectInvitation';

import './style.scss';

export default function Banner(props) {
  const {
    acceptInvitation,
    declineInvitation,
    className,
    showDeclineModal,
    disabled,
    // sticky.js internal needs
    ref,
  } = props;
  let {
    invitation,
  } = props;
  const classes = new BEMHelper('invite-banner');
  const isActive = !disabled && invitation !== null;
  const modifiers = {
    active: isActive,
  };

  if (!invitation) {
    invitation = {
      user: {},
      actionType: '',
      entity: '',
    };
  }
  const {
    user,
    actionType,
    entity,
    inviteMessage
  } = invitation;

  return (
    <div
      {...classes({
        extra: className,
        modifiers,
      })}
      ref={ref}
    >
      {isActive &&
        [<div key={0} {...classes('avatar')}>
          <Avatar img={ activityApiPaths.userpic(user.id) } />
        </div>,
        <div key={1} {...classes('info')}>
          <label {...classes('title')}>
            You've been invited
          </label>
          <span {...classes('descr')}>
            <Link {...classes('invited-by')} to={paths.user(user.id)}>
              {`${user.firstname} ${user.lastname}`}
            </Link>
            <span {...classes('invite-text')}>
              {`${actionType} ${entity.title}`}
              {inviteMessage && `: ${inviteMessage.length > 100 ? inviteMessage.substring(0, 100) + '...' : inviteMessage}`}
            </span>
          </span>
        </div>,
        <div key={2} {...classes('action-list')}>
          <Button
            {...classes('action', 'approve')}
            mods={['rounded']}
            label="Accept"
            onClick={() => acceptInvitation()}
          />
          <Link
            {...classes('action', 'decline')}
            onClick={showDeclineModal}
          >
            Decline
          </Link>
        </div>]
      }
      <DeclineModal onDecline={declineInvitation} />
    </div>
  );
}
