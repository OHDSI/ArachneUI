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
 * Created: January 30, 2017
 *
 */

import { createSelector } from 'reselect';
import get from 'lodash/get';
import moment from 'moment';
import { paths, apiPaths } from 'modules/Portal/const';
import { paths as analysisPaths } from 'modules/AnalysisExecution/const';
import { paths as paperPaths } from 'modules/InsightsLibrary/const';

const getRawInvitations = state => get(state, 'portal.invitation.queryResult.result', []) || [];

const getInvitations = createSelector(
  [getRawInvitations],
  rawList => rawList.map((invite) => {
    const invitation = { ...invite };
    const entity = { title: invite.entity.title };

    switch (invitation.type) {
      case 'UNLOCK_ANALYSIS':
      case 'APPROVE_PUBLISH_SUBMISSION':
      case 'APPROVE_EXECUTE_SUBMISSION':
        entity.path = analysisPaths.analyses(invite.entity.id);
        break;
      case 'PAPER_PARTICIPANT':
        entity.path = paperPaths.insights({insightId: invite.entity.id});
        break;
      default: entity.path = paths.study(invite.entity.id);
    }

    invitation.date = moment(invite.date).fromNow();
    invitation.entity = entity;
    invitation.userPic = apiPaths.userpic(invite.user.id);
    invitation.user.profilePath = paths.userProfile(invite.user.id);

    return invitation;
  }),
);

export default {
  getInvitations,
};
