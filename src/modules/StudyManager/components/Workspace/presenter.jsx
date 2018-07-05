/*
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
 * Authors: Anton Gackovka
 * Created: June 4, 2018
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';

import { LoadingPanel, PageContent } from 'arachne-ui-components';
import InviteRestrictedArea from 'components/InviteRestrictedArea';

import ModalAddDataSource from 'modules/StudyManager/components/ViewEdit/ModalAddDataSource';
import ModalConfirmDatasource from 'modules/StudyManager/components/ViewEdit/ModalConfirmDatasource';
import ModalCreateDocument from 'modules/StudyManager/components/ViewEdit/ModalCreateDocument';
import ModalCreateAnalysis from 'modules/StudyManager/components/ViewEdit/ModalCreateAnalysis';

import RightColumn from './RightColumn';
import LeftColumn from './LeftColumn';

import Toolbar from './Toolbar';

require('./style.scss');

function Workspace(props) {
  const {
    studyTitle,
    isLoading,
    onBannerActed,
    studyId,
    toolbarSettings,
  } = props;
  const classes = new BEMHelper('workspace-view');

  return (
    <PageContent title={`${studyTitle} | Arachne`}>
      <div {...classes()}>
        <InviteRestrictedArea
          {...classes('container')}
          studyId={studyId}
          onAction={onBannerActed}
          disabled={isLoading}
        >
          <Toolbar toolbarSettings={toolbarSettings} />
          <div {...classes('content')}>
            <div className="row">
              <div className="col-xs-12 col-lg-6">
                <div className="row">
                  <div className="col-xs-12">
                    <LeftColumn/>
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-lg-6">
                <RightColumn studyId={studyId} />
              </div>
            </div>
          </div>
        </InviteRestrictedArea>
        <LoadingPanel active={isLoading} />
      </div>
      <ModalCreateAnalysis />
      <ModalCreateDocument />
      <ModalConfirmDatasource />
      <ModalAddDataSource />
    </PageContent>
  );
}

Workspace.propTypes = {
  studyTitle: PropTypes.string,
  isLoading: PropTypes.bool,
  id: PropTypes.number,
  accessGranted: PropTypes.bool,
  goBack: PropTypes.func,
};

export default Workspace;
