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
 * Created: July 13, 2017
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import { StickyContainer, Sticky } from 'react-sticky';
import {
  Link,
} from 'arachne-ui-components';
import EmptyState from 'components/EmptyState';
import Banner from './Banner';

import './style.scss';

function InviteRestrictedArea(props) {
  const {
    children,
    onAccept,
    onDecline,
    accessGranted,
    goBack,
    invitation,
    isLoading,
    studyId,
    disabled,
  } = props;
  const classes = new BEMHelper('invite-restricted-area');
  const emptyStateMessage = (
    <div {...classes('empty-state')}>
      <span>You do not have access rights for this study. Please contact a study lead investigator.</span>
      <Link onClick={goBack}>Go back</Link>
    </div>
  );

  if (!studyId && isLoading) {
    return null;
  }

  const content = (
    <div {...classes()}>
      <StickyContainer>
        <Sticky>
          {
            ({ isSticky }) => <Banner
                className={isSticky ? classes({
                  element: 'sticky-banner',
                }).className : null}
                invitation={invitation}
                acceptInvitation={onAccept}
                declineInvitation={onDecline}
                disabled={disabled}
              />
          }
        </Sticky>
        {children}
      </StickyContainer>
    </div>
  );

  return (
      accessGranted
      ? content
      : <EmptyState message={emptyStateMessage} />
  );
}

InviteRestrictedArea.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  onAccept: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
};

export default InviteRestrictedArea;
