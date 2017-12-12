import React from 'react';
import BEMHelper from 'services/BemHelper';
import { Avatar, Button, Link } from 'arachne-ui-components';
import {
  apiPaths as activityApiPaths,
} from 'const/activity';
import { paths } from 'modules/StudyManager/const';

import './style.scss';

function InviteBanner({
  invitation,
  acceptInvitation,
  declineInvitation,
  className,
}) {
  const classes = new BEMHelper('study-invite-banner');

  if (!invitation) {
    return null;
  }

  const {
    user,
    actionType,
    entity,
  } = invitation;

  return (
    <div {...classes({ extra: className })}>
      <div {...classes('avatar')}>
        <Avatar img={ activityApiPaths.userpic(user.id) } />
      </div>
      <div {...classes('info')}>
        <label {...classes('title')}>
          You've been invited
        </label>
        <span {...classes('descr')}>
          <Link {...classes('invited-by')} to={paths.user(user.id)}>
            {`${user.firstname} ${user.lastname}`}
          </Link>
          <span {...classes('invite-text')}>
            {`${actionType} ${entity.title}`}
          </span>
        </span>
      </div>
      <div {...classes('action-list')}>
        <Button
          {...classes('action', 'approve')}
          mods={['rounded']}
          label="Accept"
          onClick={acceptInvitation}
        />
        <Link
          {...classes('action', 'decline')}
          onClick={declineInvitation}
        >
          Decline
        </Link>
      </div>
    </div>
  );
}

export default InviteBanner;
